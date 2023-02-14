import { JWTPayload, User, UserDocument } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { AuthService } from './auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailsService } from '../../notifications/services/emails.service';

@Injectable()
export class AccountService {
  constructor(
    @Inject(AuthService) private authService: AuthService,
    @Inject(EmailsService) private emailsService: EmailsService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  //#region Get Updated Data
  async getUpdatedData(user: JWTPayload): Promise<JWTPayload> {
    user['iat'] = undefined;
    user['exp'] = undefined;
    return user;
  }
  //#endregion

  //#region Update User Profile
  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<void | { emailLink: string }> {
    // Update User Data
    const user = await this.userModel
      .findOneAndUpdate({ _id: userId }, updateProfileDto, {
        returnOriginal: false,
      })
      .select('+verificationCode');

    // if email is change then send verification email
    if (updateProfileDto?.email) {
      const emailLink = await this.emailsService.sendVerificationCode({
        code: user.verificationCode,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      });

      return { emailLink };
    }
  }
  //#endregion

  //#region Request change password
  async sendChangePasswordLink(user: JWTPayload): Promise<string> {
    // Update Set Password Token
    const setPasswordToken = this.authService.generateSetPasswordToken(user.id);
    await this.userModel.updateOne(
      { _id: user.id },
      { $set: { setPasswordToken } },
    );

    // Send Email
    const emailLink = await this.emailsService.sendResetPasswordEmail({
      email: user.email,
      token: setPasswordToken,
    });

    return emailLink;
  }
  //#endregion
}
