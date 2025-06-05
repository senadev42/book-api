import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig, {
  DatabaseConfiguration,
  DB_CONFIG,
} from './config/database.config';
import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { BooksModule } from './books/books.module';
import storageConfig from './config/storage.config';
import { StorageModule } from './storage/storage.module';
import { Environment } from './config/enviroment';
import { validateEnvironment } from './validate-env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config: Environment) =>
        validateEnvironment(config, Environment),
      load: [appConfig, jwtConfig, storageConfig, databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get<DatabaseConfiguration>(DB_CONFIG),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    BooksModule,
    StorageModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
