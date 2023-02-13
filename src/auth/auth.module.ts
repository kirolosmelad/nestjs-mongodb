import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWTStrategy } from './strategies/jwt.strategy';
import { SharedModule } from '@app/shared';
import { AuthorizationGuard } from './guards';

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
  providers: [AuthService, JWTStrategy, AuthorizationGuard],
  controllers: [AuthController],
  exports: [AuthorizationGuard, AuthService],
})
export class AuthModule {}
