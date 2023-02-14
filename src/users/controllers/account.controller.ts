import { Body, Controller, Get, Inject, Patch } from '@nestjs/common';
import { GetUser, JWTPayload, SkipEmailVerification } from '@app/shared';
import { AccountService } from '../services/account.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Controller('users/account')
export class AccountController {
  constructor(@Inject(AccountService) private accountService: AccountService) {}

  //#region Get Updated Data
  @SkipEmailVerification()
  @Get('/updated-data')
  async getUpdatedData(@GetUser() user: JWTPayload): Promise<JWTPayload> {
    return this.accountService.getUpdatedData(user);
  }
  //#endregion

  //#region Update Profile Data
  @Patch('/profile')
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @GetUser() user: JWTPayload,
  ) {
    const data = await this.accountService.updateProfile(
      user.id,
      updateProfileDto,
    );

    return {
      message: updateProfileDto?.email
        ? 'Profile updated successfully , please verify your new email'
        : 'Profile updated successfully',
      ...data,
    };
  }
  //#endregion
}
