import { Controller, Get, Inject } from '@nestjs/common';
import { GetUser, JWTPayload, SkipEmailVerification } from '@app/shared';
import { AccountService } from '../services/account.service';

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
}
