import { SetMetadata } from '@nestjs/common';

export const SKIP_EMAIL_VERIFICATION = 'skip_email';
export const SkipEmailVerification = () =>
  SetMetadata(SKIP_EMAIL_VERIFICATION, true);
