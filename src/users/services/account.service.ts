import { JWTPayload } from '@app/shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountService {
  //#region Get Updated Data
  async getUpdatedData(user: JWTPayload): Promise<JWTPayload> {
    user.iat = undefined;
    return user;
  }
  //#endregion
}
