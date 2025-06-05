import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

enum NodeEnv {
  Development = 'development',
  Production = 'production',
}

export class Environment {
  // app.config.ts
  @IsEnum(NodeEnv)
  @IsNotEmpty()
  NODE_ENV: NodeEnv;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(0)
  @Max(65535)
  @IsNotEmpty()
  PORT: number;

  // database.config.ts
  @IsString()
  @IsNotEmpty()
  POSTGRES_DB: string;

  @IsString()
  @IsNotEmpty()
  POSTGRES_USER: string;

  @IsString()
  @IsNotEmpty()
  POSTGRES_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  POSTGRES_HOST: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(0)
  @Max(65535)
  @IsNotEmpty()
  POSTGRES_PORT: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  LOGGING: boolean;

  // jwt.config.ts
  @IsOptional()
  @IsString()
  JWT_PRIVATE_KEY?: string;

  @IsOptional()
  @IsString()
  JWT_PUBLIC_KEY?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(0)
  @Max(3600)
  JWT_EXPIRATION_TIME?: number;
}
