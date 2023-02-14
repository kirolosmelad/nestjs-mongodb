export interface JWTPayload {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified?: boolean;
  iat?: number;
  exp?: number;
}
