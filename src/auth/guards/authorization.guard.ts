import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  IS_PUBLIC_KEY,
  JWTPayload,
  SKIP_EMAIL_VERIFICATION,
} from '@app/shared';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthorizationGuard
  extends AuthGuard('jwt')
  implements CanActivate
{
  constructor(
    @Inject(AuthService) private authService: AuthService,
    private reflector: Reflector,
  ) {
    super();
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    // If Public router then return
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    // Validate user
    await super.canActivate(context);

    // Get User From Request (after decoding paylod from super class)
    const payload = context.switchToHttp().getRequest()?.user as JWTPayload;

    // Check User Existence
    const user = await this.authService.checkUserExistence({ id: payload.id });
    if (!user) throw new UnauthorizedException();

    // Add Some data to our payload
    payload.verificationCode = user.verificationCode;

    const skipEmailVerification = this.reflector.getAllAndOverride<boolean>(
      SKIP_EMAIL_VERIFICATION,
      [context.getHandler(), context.getClass()],
    );
    if (!skipEmailVerification && !user?.isEmailVerified) return false;

    return true;
  }
}
