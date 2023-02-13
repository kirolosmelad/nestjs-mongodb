import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../entities/user.entity';
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
  ): Promise<{ user: User; token: string }> {
    const user: UserDocument = await new this.userModel(registerDto).save();

    // Delete Password
    user.password = undefined;

    // Assign Token
    const token = this.assignTokenToUser(user);

    return { user, token };
  }
  //#endregion

  //#region Login
  async login(loginDto: LoginDto): Promise<{ user: User; token: string }> {
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (!user || !(await bcrypt.compare(loginDto.password, user.password)))
      throw new BadRequestException('Invalid email or password');

    const token = this.assignTokenToUser(user);

    return { user, token };
  }
  //#endregion

  //#region Check User Existence
  async checkUserExistence(userId: string): Promise<User> {
    return await this.userModel.findOne({ id: userId });
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
