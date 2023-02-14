import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create(AppModule);

  //#region Security Middlewares
  app.use(helmet());
  app.enableCors();
  //#endregion

  app.setGlobalPrefix('/api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  await app.listen(3000);
})();
