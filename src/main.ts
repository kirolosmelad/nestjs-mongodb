import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { VersioningType } from '@nestjs/common';

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
