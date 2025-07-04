import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { MarketIntelligenceController } from './market-intelligence.controller';
import { MarketIntelligenceService } from './market-intelligence.service';
import { PncpService } from './services/pncp.service';
import { TenderMonitoringService } from './services/tender-monitoring.service';
import { Tender } from './entities/tender.entity';
import { TenderMonitoring } from './entities/tender-monitoring.entity';
import { MarketAnalysis } from './entities/market-analysis.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tender,
      TenderMonitoring,
      MarketAnalysis,
    ]),
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [MarketIntelligenceController],
  providers: [
    MarketIntelligenceService,
    PncpService,
    TenderMonitoringService,
  ],
  exports: [MarketIntelligenceService, PncpService],
})
export class MarketIntelligenceModule {}
