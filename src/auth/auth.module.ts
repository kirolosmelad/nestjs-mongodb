import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SharedModule } from '@app/shared';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JWTStrategy } from './strategies/jwt.strategy';
import { AuthorizationGuard } from './guards/authorization.guard';
import { AccountController } from './controllers/account.controller';
import { AccountService } from './services/account.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('TOKEN_SECRET'),
      }),
    }),
    SharedModule,
  ],
  providers: [AuthService, JWTStrategy, AuthorizationGuard, AccountService],
  controllers: [AuthController, AccountController],
  exports: [AuthorizationGuard, AuthService],
})
export class AuthModule {}
