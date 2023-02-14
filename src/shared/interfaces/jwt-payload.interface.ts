export interface JWTPayload {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  verificationCode?: string;
  isEmailVerified?: boolean;
  iat?: number;
}
