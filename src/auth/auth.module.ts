import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWTStrategy } from './strategies/jwt.strategy';
import { AuthorizationGuard } from './guards/authorization.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('TOKEN_SECRET'),
      }),
    }),
  ],
  providers: [AuthService, JWTStrategy, AuthorizationGuard],
  controllers: [AuthController],
  exports: [AuthorizationGuard, AuthService],
})
export class AuthModule {}
