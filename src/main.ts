import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

(async () => {
  const app = await NestFactory.create(AppModule);

  //#region Security Middlewares
  app.use(helmet());
  app.enableCors();
  //#endregion

  await app.listen(3000);
})();
