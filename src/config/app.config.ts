import { registerAs } from '@nestjs/config';

export const APP_CONFIG = 'APP_CONFIG';

export type AppConfiguration = {
  port: number;
  nodeEnv: string;
  isProduction: boolean;
};

export default registerAs(
  APP_CONFIG,
  (): AppConfiguration => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
  }),
);
