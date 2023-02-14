import { Controller, Get, Inject } from '@nestjs/common';
import { AccountService } from '../services/account.service';
import { GetUser, JWTPayload, SkipEmailVerification } from '@app/shared';

@Controller('auth/account')
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
