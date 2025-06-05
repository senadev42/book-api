import { registerAs } from '@nestjs/config';

export const STORAGE_CONFIG = 'storage_config';

export interface StorageConfig {
  region?: string;
  endpoint?: string;
  port?: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
  bucket: string;
  publicUrl?: string;
}

export default registerAs(STORAGE_CONFIG, (): StorageConfig => {
  return {
    endpoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_API_PORT || '9000'),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    publicUrl: process.env.MINIO_PUBLIC_URL,
    accessKey: process.env.STORAGE_ACCESS_KEY,
    secretKey: process.env.STORAGE_SECRET_KEY,
    bucket: process.env.STORAGE_BUCKET,
  };
});
