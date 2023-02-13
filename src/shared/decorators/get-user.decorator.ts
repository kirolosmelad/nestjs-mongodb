import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { JWTPayload } from '../interfaces/jwt-payload.interface';

export const GetUser = createParamDecorator(
  (_data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();

    return req.user as JWTPayload;
  },
);
