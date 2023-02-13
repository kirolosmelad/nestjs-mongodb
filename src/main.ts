import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as csurf from 'csurf';

(async () => {
  const app = await NestFactory.create(AppModule);

  //#region Security Middlewares
  app.use(helmet());
  app.enableCors();
  app.use(csurf());
  //#endregion

  await app.listen(3000);
})();
