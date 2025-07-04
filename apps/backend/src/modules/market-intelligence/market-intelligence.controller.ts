import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MarketIntelligenceService, TenderSearchParams } from './market-intelligence.service';
// import { TenderMonitoringService } from './services/tender-monitoring.service'; // Comentado temporariamente
import { PncpService } from './services/pncp.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenderMonitoring } from './entities/tender-monitoring.entity';
import { MarketAnalysis } from './entities/market-analysis.entity';

@Controller('market-intelligence')
@UseGuards(JwtAuthGuard)
export class MarketIntelligenceController {
  constructor(
    private marketIntelligenceService: MarketIntelligenceService,
    // private monitoringService: TenderMonitoringService, // Comentado temporariamente
    private pncpService: PncpService,
  ) {}

  // Endpoints de Licitações
  @Get('tenders')
  async getTenders(@Query() params: TenderSearchParams) {
    return this.marketIntelligenceService.searchTenders(params);
  }

  @Get('tenders/:id')
  async getTender(@Param('id') id: string) {
    return this.marketIntelligenceService.getTender(id);
  }

  @Put('tenders/:id')
  async updateTender(@Param('id') id: string, @Body() updateData: any) {
    return this.marketIntelligenceService.updateTender(id, updateData);
  }

  @Post('tenders/:id/mark-opportunity')
  async markAsOpportunity(@Param('id') id: string, @Request() req) {
    return this.marketIntelligenceService.markAsOpportunity(id, req.user.id);
  }

  @Post('tenders/sync')
  async syncTenders(@Body() params: any) {
    return this.marketIntelligenceService.syncWithPncp(params);
  }

  // Endpoints de Dashboard e Estatísticas
  @Get('dashboard/stats')
  async getDashboardStats() {
    return this.marketIntelligenceService.getDashboardStats();
  }

  @Get('dashboard/charts')
  async getChartData() {
    return this.marketIntelligenceService.getChartData();
  }

  // Endpoints de Monitoramento - TEMPORARIAMENTE DESABILITADOS
  /*
  @Get('monitoring')
  async getMonitorings(@Request() req) {
    return this.monitoringService.getUserMonitorings(req.user.id);
  }

  @Post('monitoring')
  async createMonitoring(@Request() req, @Body() monitoringData: Partial<TenderMonitoring>) {
    return this.monitoringService.createMonitoring(req.user.id, monitoringData);
  }

  @Put('monitoring/:id')
  async updateMonitoring(
    @Param('id') id: string,
    @Request() req,
    @Body() updateData: Partial<TenderMonitoring>
  ) {
    return this.monitoringService.updateMonitoring(id, req.user.id, updateData);
  }

  @Delete('monitoring/:id')
  async deleteMonitoring(@Param('id') id: string, @Request() req) {
    await this.monitoringService.deleteMonitoring(id, req.user.id);
    return { message: 'Monitoring deleted successfully' };
  }

  @Post('monitoring/:id/pause')
  async pauseMonitoring(@Param('id') id: string, @Request() req) {
    return this.monitoringService.pauseMonitoring(id, req.user.id);
  }

  @Post('monitoring/:id/resume')
  async resumeMonitoring(@Param('id') id: string, @Request() req) {
    return this.monitoringService.resumeMonitoring(id, req.user.id);
  }
  */

  // Endpoints de Análise de Mercado
  @Get('analysis')
  async getAnalyses(@Request() req) {
    return this.marketIntelligenceService.getUserAnalyses(req.user.id);
  }

  @Post('analysis')
  async createAnalysis(@Request() req, @Body() analysisData: Partial<MarketAnalysis>) {
    return this.marketIntelligenceService.createMarketAnalysis(req.user.id, analysisData);
  }

  // Endpoints PNCP
  @Get('pncp/search')
  async searchPncp(@Query() params: any) {
    return this.pncpService.searchTenders(params);
  }

  @Get('pncp/modalidades')
  async getModalidades() {
    return this.pncpService.getModalidades();
  }

  @Get('pncp/ufs')
  async getUfs() {
    return this.pncpService.getUfs();
  }

  @Get('pncp/tender/:id')
  async getPncpTender(@Param('id') id: string) {
    return this.pncpService.getTenderDetails(id);
  }

  @Get('pncp/tender/:id/items')
  async getPncpTenderItems(@Param('id') id: string) {
    return this.pncpService.getTenderItems(id);
  }

  @Get('pncp/tender/:id/documents')
  async getPncpTenderDocuments(@Param('id') id: string) {
    return this.pncpService.getTenderDocuments(id);
  }

  // Health Check
  @Get('health')
  health() {
    return { 
      status: 'OK', 
      service: 'Solution Hub Market Intelligence Service',
      timestamp: new Date().toISOString(),
    };
  }
}
