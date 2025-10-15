import { registerAs } from '@nestjs/config';

type AppConfig = {
  port: number;
  jwtSecret: string;
  jwtExpiresIn: string;
  jwtRefreshSecret: string;
  jwtRefreshExpiresIn: string;
  whatsappProviderUrl: string;
  whatsappApiKey: string;
  whatsappInstanceId: string;
  whatsappWebhookSecret: string;
};

type DatabaseConfig = {
  url: string;
};

type RedisConfig = {
  url: string;
};

export default registerAs('app', (): AppConfig & { database: DatabaseConfig; redis: RedisConfig } => ({
  port: parseInt(process.env.PORT || '3333', 10),
  jwtSecret: process.env.JWT_SECRET || 'secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  whatsappProviderUrl: process.env.WHATSAPP_PROVIDER_URL || '',
  whatsappApiKey: process.env.WHATSAPP_API_KEY || '',
  whatsappInstanceId: process.env.WHATSAPP_INSTANCE_ID || '',
  whatsappWebhookSecret: process.env.WHATSAPP_WEBHOOK_SECRET || '',
  database: {
    url: process.env.DATABASE_URL || '',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
}));
