import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailsService } from './services/emails.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: 'jzv32jxbyb7vh57c@ethereal.email',
            pass: 'BdgwWFtezDmeTjP38K',
          },
        },
      }),
    }),
  ],
  providers: [EmailsService],
  exports: [EmailsService],
})
export class NotificationsModule {}
