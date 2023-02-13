import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JWTPayload, SetNewPasswordDto } from '@app/shared';
import * as bcrypt from 'bcrypt';
import { FilterQuery, Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '@app/shared';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { GetForgetPasswordTokenDto } from '../dto/get-forget-password-token';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  //#region Register New User
  async register(
    registerDto: RegisterDto,
  ): Promise<{ user: UserDocument; token: string }> {
    const user: UserDocument = await new this.userModel(registerDto).save();

    // Assign Token
    const token = this.assignTokenToUser(user);

    // TODO : Send Email With new Code

    return { user, token };
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

  //#region Verify Email
  async verifyEmail(userId: string, code: string): Promise<UserDocument> {
    // Check User Existence & code
    const user = await this.checkUserExistence({
      id: userId,
      verificationCode: code,
    });
    if (!user) throw new BadRequestException('Invalid verification code');

    // Verify Email in database
    user.isEmailVerified = true;
    user.verificationCode = undefined;
    return user.save();
  }
  //#endregion

  //#region Re-Send Email Verification Code
  async resendVerificationCode(userId: string): Promise<UserDocument> {
    const user = await this.userModel
      .findOne({ id: userId })
      .select('+verificationCode');
    if (!user) throw new NotFoundException('User is not exist');
    if (user.isEmailVerified)
      throw new BadRequestException('User email is already verified');

    // TODO : Send Code in Email

    return user;
  }
  //#endregion

  //#region Get Forget Password Token
  async getForgetPasswordToken(
    getForgetPasswordTokenDto: GetForgetPasswordTokenDto,
  ) {
    // Check User Existence
    const user = await this.checkUserExistence({
      email: getForgetPasswordTokenDto.email,
    });
    if (!user)
      throw new BadRequestException('Wrong email , please signup first');

    // Update Set Password Token
    user.setPasswordToken = this.generateSetPasswordToken(user.id);

    // TODO : Send Email With token

    return user.save();
  }
  //#endregion

  //#region Verify Token
  verifySetPasswordToken(token: string): { id: string } {
    return this.jwtService.verify(token);
  }
  //#endregion

  //#region Set New Password
  async setNewPassword(
    setNewPasswordDto: SetNewPasswordDto,
  ): Promise<UserDocument> {
    // Verify Token
    const userId = this.verifySetPasswordToken(setNewPasswordDto.token).id;

    // Check User Existence
    const user = await this.checkUserExistence({
      id: userId,
      setPasswordToken: setNewPasswordDto.token,
    });
    if (!user)
      throw new BadRequestException('Wrong email , please signup first');

    // Update Password and remove set password token
    user.password = setNewPasswordDto.password;
    user.setPasswordToken = undefined;

    return user.save();
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
