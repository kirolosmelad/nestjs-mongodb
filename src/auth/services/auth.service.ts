import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { FilterQuery, Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '@app/shared';
import { RegisterDto } from '../dto/register.dto';
import { JWTPayload } from '@app/shared';
import { LoginDto } from '../dto/login.dto';

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

    // Delete Password
    user.password = undefined;
    // Remove Verification Code
    user.verificationCode = undefined;

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

    // Delete Password
    user.password = undefined;

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

  //#region Check User Existence
  async checkUserExistence(filters: FilterQuery<User>): Promise<UserDocument> {
    return await this.userModel.findOne(filters);
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
