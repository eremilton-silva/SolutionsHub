import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigService } from './common/config/app-config.service';
import { AuthModule } from './modules/auth/auth.module';
import { CrmModule } from './modules/crm/crm.module';
import { OpportunitiesModule } from './modules/opportunities/opportunities.module';
import { MarketIntelligenceModule } from './modules/market-intelligence/market-intelligence.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
// Importing specific entities for SQLite compatibility
import { User } from './modules/auth/entities/user.entity';
import { Client } from './modules/crm/entities/client.entity';
import { Opportunity } from './modules/opportunities/entities/opportunity.entity';
import { Tender } from './modules/market-intelligence/entities/tender.entity';
import { MarketAnalysis } from './modules/market-intelligence/entities/market-analysis.entity';
import { TenderMonitoring } from './modules/market-intelligence/entities/tender-monitoring.entity';
import { Notification } from './modules/notifications/entities/notification.entity';
import { NotificationTemplate } from './modules/notifications/entities/notification-template.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './solution_hub_dev.sqlite',
      entities: [
        User, 
        Client, 
        Opportunity, 
        Tender, 
        MarketAnalysis, 
        TenderMonitoring, 
        Notification, 
        NotificationTemplate
      ],
      synchronize: true,
      logging: true,
    }),
    AuthModule,
    CrmModule,
    OpportunitiesModule,
    MarketIntelligenceModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppConfigService],
  exports: [AppConfigService],
})
export class AppModule {}
