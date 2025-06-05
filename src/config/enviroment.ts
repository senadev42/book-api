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
  @IsEnum(NodeEnv)
  @IsNotEmpty()
  NODE_ENV: NodeEnv;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(0)
  @Max(65535)
  @IsNotEmpty()
  PORT: number;

  // Database
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

  // Optional PgAdmin settings
  @IsOptional()
  @IsString()
  PGADMIN_DEFAULT_EMAIL?: string;

  @IsOptional()
  @IsString()
  PGADMIN_DEFAULT_PASSWORD?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(0)
  @Max(65535)
  PGADMIN_PORT?: number;
}
