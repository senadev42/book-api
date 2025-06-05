import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { APP_CONFIG, AppConfiguration } from './config/app.config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //configs
  const configService = app.get<ConfigService>(ConfigService);
  const appConfig = configService.get<AppConfiguration>(APP_CONFIG);

  // validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Logging
  if (appConfig.isProduction) {
    app.use(
      morgan('combined', {
        skip: (req, res) => res.statusCode < 400, // Only log errors in production
      }),
    );
  } else {
    app.use(morgan('dev'));
  }

  //swagger
  const options = new DocumentBuilder()
    .setTitle('Birdhouse API')
    .setDescription('API for managing birdhouses')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(`/swagger`, app, document);

  await app.listen(appConfig.port);
}
bootstrap();
