import { JWTPayload } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { AuthService } from './auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../entities';
import { Model } from 'mongoose';
import { EmailsService } from 'src/notifications/services/emails.service';

@Injectable()
export class AccountService {
  constructor(
    @Inject(AuthService) private authService: AuthService,
    @Inject(EmailsService) private emailsService: EmailsService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  //#region Get Updated Data
  async getUpdatedData(user: JWTPayload): Promise<JWTPayload> {
    user.iat = undefined;
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
}
