import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppConfigService } from './common/config/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Get configuration service
  const appConfigService = app.get(AppConfigService);
  const appConfig = appConfigService.appConfig;

  // Enable CORS
  app.enableCors({
    origin: appConfig.frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global prefix
  app.setGlobalPrefix(appConfig.apiPrefix);

  await app.listen(appConfig.port);
  
  console.log(`🚀 Solution Hub API is running on: http://localhost:${appConfig.port}/${appConfig.apiPrefix}`);
  console.log(`📚 Environment: ${appConfig.nodeEnv}`);
}

bootstrap();
