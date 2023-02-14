import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ExceptionFilter } from '@app/shared';
import { ConfigValidationSchema } from './config.schema';
import { UsersModule } from './users/users.module';
import { AuthorizationGuard } from './users/guards/authorization.guard';
import { NotificationsModule } from './notifications/notifications.module';
import { AddressesModule } from './addresses/addresses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${__dirname}/../.env`,
      validationSchema: ConfigValidationSchema,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService
          .get<string>('MONGODB_URI')
          .replace('<PASSWORD>', configService.get<string>('MONGODB_PASSWORD')),
      }),
    }),
    UsersModule,
    NotificationsModule,
    AddressesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
  ],
})
export class AppModule {}
