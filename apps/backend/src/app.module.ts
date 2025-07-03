import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigService } from './common/config/app-config.service';
import { createTypeOrmConfig } from './database/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { CrmModule } from './modules/crm/crm.module';
import { MarketIntelligenceModule } from './modules/market-intelligence/market-intelligence.module';
import { OpportunitiesModule } from './modules/opportunities/opportunities.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    // Global configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Schedule module for cron jobs
    ScheduleModule.forRoot(),
    
    // Database module
    TypeOrmModule.forRootAsync({
      useFactory: (appConfigService: AppConfigService) =>
        createTypeOrmConfig(appConfigService),
      inject: [AppConfigService],
    }),
    
    // Application modules
    AuthModule,
    CrmModule,
    MarketIntelligenceModule,
    OpportunitiesModule,
    NotificationsModule,
    // FinancialModule,
    // FinancialModule,
    // DocumentsModule,
    // AnalyticsModule,
    // ProductivityModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppConfigService],
})
export class AppModule {}
