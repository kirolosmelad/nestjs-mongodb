import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY, JWTPayload } from '../../shared';
import { AuthService } from '../services/auth.service';
import { Reflector } from '@nestjs/core';

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

    // Call JWT Strategy to validate user
    await super.canActivate(context);

    // Get User From Request (after decoding paylod from super class)
    const payload = context.switchToHttp().getRequest()?.user as JWTPayload;

    // Check User Existence
    const user = await this.authService.checkUserExistence(payload.id);
    if (!user) throw new UnauthorizedException();

    return true;
  }
}