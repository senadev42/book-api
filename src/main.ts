import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { APP_CONFIG, AppConfiguration } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //configs
  const configService = app.get<ConfigService>(ConfigService);
  const appConfig = configService.get<AppConfiguration>(APP_CONFIG);

  await app.listen(appConfig.port);
}
bootstrap();
