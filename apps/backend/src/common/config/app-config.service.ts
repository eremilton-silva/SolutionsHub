import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  // Database Configuration
  get databaseConfig() {
    return {
      host: this.configService.get<string>('DATABASE_HOST', 'localhost'),
      port: this.configService.get<number>('DATABASE_PORT', 5432),
      username: this.configService.get<string>('DATABASE_USERNAME', 'postgres'),
      password: this.configService.get<string>('DATABASE_PASSWORD', 'postgres'),
      database: this.configService.get<string>('DATABASE_NAME', 'solution_hub'),
    };
  }

  // JWT Configuration
  get jwtConfig() {
    return {
      secret: this.configService.get<string>('JWT_SECRET', 'default-secret'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m'),
      refreshSecret: this.configService.get<string>('JWT_REFRESH_SECRET', 'default-refresh-secret'),
      refreshExpiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    };
  }

  // App Configuration
  get appConfig() {
    return {
      nodeEnv: this.configService.get<string>('NODE_ENV', 'development'),
      port: this.configService.get<number>('PORT', 3001),
      apiPrefix: this.configService.get<string>('API_PREFIX', 'api/v1'),
      frontendUrl: this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000'),
    };
  }

  // PNCP API Configuration
  get pncpConfig() {
    return {
      apiUrl: this.configService.get<string>('PNCP_API_URL', 'https://pncp.gov.br/api'),
      token: this.configService.get<string>('PNCP_API_TOKEN'),
    };
  }

  // WhatsApp Configuration
  get whatsappConfig() {
    return {
      apiUrl: this.configService.get<string>('WHATSAPP_API_URL', 'https://graph.facebook.com/v17.0'),
      accessToken: this.configService.get<string>('WHATSAPP_ACCESS_TOKEN'),
      phoneNumberId: this.configService.get<string>('WHATSAPP_PHONE_NUMBER_ID'),
    };
  }

  // Email Configuration
  get emailConfig() {
    return {
      sendgridApiKey: this.configService.get<string>('SENDGRID_API_KEY'),
      fromEmail: this.configService.get<string>('SENDGRID_FROM_EMAIL', 'noreply@solutionhub.com.br'),
    };
  }

  // AWS Configuration
  get awsConfig() {
    return {
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
      s3Bucket: this.configService.get<string>('AWS_S3_BUCKET', 'solution-hub-documents'),
    };
  }

  // Digital Signature Configuration
  get digitalSignatureConfig() {
    return {
      clicksignToken: this.configService.get<string>('CLICKSIGN_API_TOKEN'),
      d4signToken: this.configService.get<string>('D4SIGN_API_TOKEN'),
    };
  }

  // Redis Configuration
  get redisConfig() {
    return {
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      password: this.configService.get<string>('REDIS_PASSWORD'),
    };
  }

  // Rate Limiting Configuration
  get rateLimitConfig() {
    return {
      ttl: this.configService.get<number>('RATE_LIMIT_TTL', 60),
      limit: this.configService.get<number>('RATE_LIMIT_LIMIT', 100),
    };
  }
}
