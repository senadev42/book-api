import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { APP_CONFIG, AppConfiguration } from './config/app.config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as morgan from 'morgan';
import { LoggerFactory } from './logger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: LoggerFactory('Nest'),
  });

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
    .setTitle('Book Management API')
    .setDescription('API for managing books')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-Auth', // This name here is important for matching up with @ApiBearerAuth() in your controllers
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(`/swagger`, app, document);

  await app.listen(appConfig.port);
}
bootstrap();
