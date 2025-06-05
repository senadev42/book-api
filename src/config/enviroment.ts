import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
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
  @ValidateIf((o) => !o.JWT_PRIVATE_KEY)
  JWT_PRIVATE_KEY?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => !o.JWT_PUBLIC_KEY)
  JWT_PUBLIC_KEY?: string;

  @IsOptional()
  @IsString()
  JWT_ACCESS_TOKEN_EXPIRES_IN?: string;

  // storage.config.ts
  @IsOptional()
  @IsString()
  MINIO_ENDPOINT?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(0)
  @Max(65535)
  MINIO_API_PORT?: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  MINIO_USE_SSL?: boolean;

  @IsOptional()
  @IsString()
  MINIO_PUBLIC_URL?: string;

  @IsString()
  @IsNotEmpty()
  STORAGE_ACCESS_KEY: string;

  @IsString()
  @IsNotEmpty()
  STORAGE_SECRET_KEY: string;

  @IsString()
  @IsNotEmpty()
  STORAGE_BUCKET: string;
}
