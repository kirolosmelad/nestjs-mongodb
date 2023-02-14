import * as bcrypt from 'bcrypt';
import { FilterQuery, Model } from 'mongoose';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from '@app/shared';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { GetForgetPasswordTokenDto } from '../dto/get-forget-password-token';
import { User, UserDocument } from '../entities';
import { SetNewPasswordDto } from '../dto/set-new-password.dto';
import { EmailsService } from 'src/notifications/services/emails.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(EmailsService) private emailsService: EmailsService,
  ) {}

  //#region Register New User
  async register(
    registerDto: RegisterDto,
  ): Promise<{ user: UserDocument; token: string; emailLink: string }> {
    const user: UserDocument = await new this.userModel(registerDto).save();

    // Assign Token
    const token = this.assignTokenToUser(user);

    // Send Email
    const emailLink = await this.emailsService.sendVerificationCode({
      code: user.verificationCode,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
    });

    return { user, token, emailLink };
  }
  //#endregion

  //#region Verify Email
  async verifyEmail(userId: string, code: string): Promise<UserDocument> {
    // Check User Existence & code
    const user = await this.userModel
      .findOne({ _id: userId })
      .select('+verificationCode');

    if (!user || (user.verificationCode && user.verificationCode !== code))
      throw new BadRequestException('Invalid verification code');
    if (user.isEmailVerified)
      throw new BadRequestException('Your email is already verified');

    // Verify Email in database
    user.isEmailVerified = true;
    user.verificationCode = undefined;
    return user.save();
  }
  //#endregion

  //#region Re-Send Email Verification Code
  async resendVerificationCode(
    userId: string,
  ): Promise<{ user: UserDocument; emailLink: string }> {
    const user = await this.userModel
      .findOne({ _id: userId })
      .select('+verificationCode');
    if (!user) throw new NotFoundException('User is not exist');
    if (user.isEmailVerified)
      throw new BadRequestException('User email is already verified');

    // Send Email
    const emailLink = await this.emailsService.sendVerificationCode({
      code: user.verificationCode,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
    });

    return { user, emailLink };
  }
  //#endregion

  //#region Login
  async login(
    loginDto: LoginDto,
  ): Promise<{ user: UserDocument; token: string }> {
    // Check User Existence
    const user = await this.userModel
      .findOne({ email: loginDto.email })
      .select('+password');
    if (!user || !(await bcrypt.compare(loginDto.password, user.password)))
      throw new BadRequestException('Invalid email or password');

    // Assign Tokens
    const token = this.assignTokenToUser(user);

    return { user, token };
  }
  //#endregion

  //#region Get Forget Password Token
  async getForgetPasswordToken(
    getForgetPasswordTokenDto: GetForgetPasswordTokenDto,
  ): Promise<{ user: UserDocument; emailLink: string }> {
    // Check User Existence
    let user = await this.checkUserExistence({
      email: getForgetPasswordTokenDto.email,
    });
    if (!user)
      throw new BadRequestException('Wrong email ,Please signup first');
    if (!user.isEmailVerified)
      throw new BadRequestException('Please verify your email first');

    // Update Set Password Token
    user.setPasswordToken = this.generateSetPasswordToken(user.id);

    // Save User
    user = await user.save();

    //  Send Email With token
    const emailLink = await this.emailsService.sendResetPasswordEmail({
      email: user.email,
      token: user.setPasswordToken,
    });

    return { user, emailLink };
  }
  //#endregion

  //#region Verify Token
  async verifySetPasswordToken(token: string): Promise<UserDocument> {
    const userId: string = this.jwtService.verify(token).id;

    // Check User Existence
    const user = await this.checkUserExistence({
      _id: userId,
      setPasswordToken: token,
    });
    if (!user) throw new BadRequestException('Invalid link');

    return user;
  }
  //#endregion

  //#region Set New Password
  async setNewPassword(
    setNewPasswordDto: SetNewPasswordDto,
  ): Promise<{ user: UserDocument; token: string }> {
    // Verify Token
    let user = await this.verifySetPasswordToken(setNewPasswordDto.token);

    // Update Password and remove set password token
    user.password = setNewPasswordDto.password;
    user.setPasswordToken = undefined;

    // Generate Access Token
    const token = this.assignTokenToUser(user);

    user = await user.save();
    return { user, token };
  }
  //#endregion

  //#region Check User Existence
  async checkUserExistence(filters: FilterQuery<User>): Promise<UserDocument> {
    return await this.userModel.findOne(filters);
  }
  //#endregion

  //#region Generate Set Password Token
  public generateSetPasswordToken(userId: string) {
    return this.jwtService.sign({ id: userId }, { expiresIn: '1h' });
  }
  //#endregion

  //#region Assign Token
  private assignTokenToUser(paylod: JWTPayload): string {
    return this.jwtService.sign({
      id: paylod.id,
      firstName: paylod.firstName,
      lastName: paylod.lastName,
      email: paylod.email,
    });
  }
  //#endregion
}
