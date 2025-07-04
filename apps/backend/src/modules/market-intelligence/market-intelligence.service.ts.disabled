import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like, Between } from 'typeorm';
import { Tender, TenderStatus, TenderType } from './entities/tender.entity';
import { MarketAnalysis, AnalysisType, AnalysisStatus } from './entities/market-analysis.entity';
import { PncpService } from './services/pncp.service';
import { TenderMonitoringService } from './services/tender-monitoring.service';

export interface TenderSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TenderStatus;
  type?: TenderType;
  organizationState?: string;
  valueMin?: number;
  valueMax?: number;
  dateStart?: Date;
  dateEnd?: Date;
  isMonitored?: boolean;
  isOpportunity?: boolean;
  assignedUserId?: string;
}

@Injectable()
export class MarketIntelligenceService {
  constructor(
    @InjectRepository(Tender)
    private tenderRepository: Repository<Tender>,
    @InjectRepository(MarketAnalysis)
    private analysisRepository: Repository<MarketAnalysis>,
    private pncpService: PncpService,
    private monitoringService: TenderMonitoringService,
  ) {}

  // Buscar licitações
  async searchTenders(params: TenderSearchParams = {}) {
    const { page = 1, limit = 20, search, status, type, organizationState, valueMin, valueMax, dateStart, dateEnd, isMonitored, isOpportunity, assignedUserId } = params;
    
    const where: FindOptionsWhere<Tender> = {};
    
    if (search) {
      where.title = Like(`%${search}%`);
    }
    
    if (status) {
      where.status = status;
    }
    
    if (type) {
      where.type = type;
    }
    
    if (organizationState) {
      where.organizationState = organizationState;
    }
    
    if (valueMin !== undefined || valueMax !== undefined) {
      where.estimatedValue = Between(valueMin || 0, valueMax || 999999999);
    }
    
    if (dateStart || dateEnd) {
      where.publishDate = Between(dateStart || new Date('1970-01-01'), dateEnd || new Date());
    }
    
    if (isMonitored !== undefined) {
      where.isMonitored = isMonitored;
    }
    
    if (isOpportunity !== undefined) {
      where.isOpportunity = isOpportunity;
    }
    
    if (assignedUserId) {
      where.assignedUserId = assignedUserId;
    }

    const [tenders, total] = await this.tenderRepository.findAndCount({
      where,
      relations: ['assignedUser'],
      skip: (page - 1) * limit,
      take: limit,
      order: { publishDate: 'DESC' },
    });

    return {
      data: tenders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Buscar licitação por ID
  async getTender(id: string): Promise<Tender> {
    const tender = await this.tenderRepository.findOne({
      where: { id },
      relations: ['assignedUser'],
    });

    if (!tender) {
      throw new NotFoundException(`Tender with ID ${id} not found`);
    }

    return tender;
  }

  // Atualizar licitação
  async updateTender(id: string, updateData: Partial<Tender>): Promise<Tender> {
    const tender = await this.getTender(id);
    Object.assign(tender, updateData);
    return this.tenderRepository.save(tender);
  }

  // Marcar como oportunidade
  async markAsOpportunity(id: string, userId: string): Promise<Tender> {
    return this.updateTender(id, {
      isOpportunity: true,
      assignedUserId: userId,
    });
  }

  // Sincronizar com PNCP
  async syncWithPncp(params: any = {}): Promise<{ synced: number; errors: string[] }> {
    const errors: string[] = [];
    let synced = 0;

    try {
      const searchResult = await this.pncpService.searchTenders({
        dataInicial: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Últimos 7 dias
        tamanhoPagina: 100,
        ...params,
      });

      for (const pncpTender of searchResult.data) {
        try {
          // Verificar se já existe
          const existingTender = await this.tenderRepository.findOne({
            where: { pncpId: pncpTender.numeroControlePNCP },
          });

          if (!existingTender) {
            // Criar nova licitação
            const tenderData = this.pncpService.mapPncpToTender(pncpTender);
            const tender = this.tenderRepository.create(tenderData);
            await this.tenderRepository.save(tender);
            synced++;
          } else {
            // Atualizar existente
            const tenderData = this.pncpService.mapPncpToTender(pncpTender);
            Object.assign(existingTender, {
              ...tenderData,
              lastSyncAt: new Date(),
            });
            await this.tenderRepository.save(existingTender);
          }
        } catch (error) {
          errors.push(`Error processing tender ${pncpTender.numeroControlePNCP}: ${error.message}`);
        }
      }
    } catch (error) {
      errors.push(`Error syncing with PNCP: ${error.message}`);
    }

    return { synced, errors };
  }

  // Obter estatísticas do dashboard
  async getDashboardStats() {
    const [
      totalTenders,
      openTenders,
      monitoredTenders,
      opportunities,
      totalValue,
      tendersThisMonth,
      tendersLastMonth,
    ] = await Promise.all([
      this.tenderRepository.count(),
      this.tenderRepository.count({ where: { status: TenderStatus.OPEN } }),
      this.tenderRepository.count({ where: { isMonitored: true } }),
      this.tenderRepository.count({ where: { isOpportunity: true } }),
      this.tenderRepository
        .createQueryBuilder('tender')
        .select('SUM(tender.estimatedValue)', 'total')
        .getRawOne(),
      this.tenderRepository
        .createQueryBuilder('tender')
        .where('tender.publishDate >= :start', { start: new Date(new Date().getFullYear(), new Date().getMonth(), 1) })
        .getCount(),
      this.tenderRepository
        .createQueryBuilder('tender')
        .where('tender.publishDate >= :start', { start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1) })
        .andWhere('tender.publishDate < :end', { end: new Date(new Date().getFullYear(), new Date().getMonth(), 1) })
        .getCount(),
    ]);

    const growth = tendersLastMonth > 0 ? ((tendersThisMonth - tendersLastMonth) / tendersLastMonth) * 100 : 0;

    return {
      totalTenders,
      openTenders,
      monitoredTenders,
      opportunities,
      totalValue: totalValue?.total || 0,
      tendersThisMonth,
      growth: Math.round(growth * 100) / 100,
    };
  }

  // Obter dados para gráficos
  async getChartData() {
    // Licitações por mês (últimos 12 meses)
    const monthlyData = await this.tenderRepository
      .createQueryBuilder('tender')
      .select([
        'EXTRACT(YEAR FROM tender.publishDate) as year',
        'EXTRACT(MONTH FROM tender.publishDate) as month',
        'COUNT(*) as count',
        'SUM(tender.estimatedValue) as value',
      ])
      .where('tender.publishDate >= :date', { date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) })
      .groupBy('EXTRACT(YEAR FROM tender.publishDate), EXTRACT(MONTH FROM tender.publishDate)')
      .orderBy('year, month')
      .getRawMany();

    // Licitações por tipo
    const typeData = await this.tenderRepository
      .createQueryBuilder('tender')
      .select(['tender.type as type', 'COUNT(*) as count'])
      .groupBy('tender.type')
      .getRawMany();

    // Licitações por estado
    const stateData = await this.tenderRepository
      .createQueryBuilder('tender')
      .select(['tender.organizationState as state', 'COUNT(*) as count'])
      .where('tender.organizationState IS NOT NULL')
      .groupBy('tender.organizationState')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    // Top organizações
    const organizationData = await this.tenderRepository
      .createQueryBuilder('tender')
      .select([
        'tender.organizationName as name',
        'COUNT(*) as count',
        'SUM(tender.estimatedValue) as value',
      ])
      .where('tender.organizationName IS NOT NULL')
      .groupBy('tender.organizationName')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      monthly: monthlyData,
      byType: typeData,
      byState: stateData,
      topOrganizations: organizationData,
    };
  }

  // Criar análise de mercado
  async createMarketAnalysis(userId: string, analysisData: Partial<MarketAnalysis>): Promise<MarketAnalysis> {
    const analysis = this.analysisRepository.create({
      ...analysisData,
      userId,
      status: AnalysisStatus.PENDING,
    });

    const savedAnalysis = await this.analysisRepository.save(analysis);

    // Processar análise em background
    this.processMarketAnalysis(savedAnalysis.id);

    return savedAnalysis;
  }

  // Obter análises do usuário
  async getUserAnalyses(userId: string): Promise<MarketAnalysis[]> {
    return this.analysisRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  // Processar análise de mercado
  private async processMarketAnalysis(analysisId: string): Promise<void> {
    try {
      await this.analysisRepository.update(analysisId, {
        status: AnalysisStatus.PROCESSING,
      });

      const analysis = await this.analysisRepository.findOne({
        where: { id: analysisId },
      });

      if (!analysis) return;

      const startTime = Date.now();

      // Aqui seria implementada a lógica específica de cada tipo de análise
      const results = await this.performAnalysis(analysis);

      const processingTime = Math.round((Date.now() - startTime) / 1000);

      await this.analysisRepository.update(analysisId, {
        status: AnalysisStatus.COMPLETED,
        results,
        processedAt: new Date(),
        processingTime,
      });
    } catch (error) {
      await this.analysisRepository.update(analysisId, {
        status: AnalysisStatus.FAILED,
        errorMessage: error.message,
      });
    }
  }

  // Executar análise específica
  private async performAnalysis(analysis: MarketAnalysis): Promise<any> {
    switch (analysis.type) {
      case AnalysisType.MARKET_OVERVIEW:
        return this.performMarketOverview(analysis);
      case AnalysisType.COMPETITION_ANALYSIS:
        return this.performCompetitionAnalysis(analysis);
      case AnalysisType.TREND_ANALYSIS:
        return this.performTrendAnalysis(analysis);
      case AnalysisType.OPPORTUNITY_MAPPING:
        return this.performOpportunityMapping(analysis);
      case AnalysisType.PRICE_ANALYSIS:
        return this.performPriceAnalysis(analysis);
      default:
        throw new Error('Unknown analysis type');
    }
  }

  private async performMarketOverview(analysis: MarketAnalysis): Promise<any> {
    // Implementar análise de visão geral do mercado
    const stats = await this.getDashboardStats();
    const chartData = await this.getChartData();

    return {
      summary: stats,
      trends: chartData,
    };
  }

  private async performCompetitionAnalysis(analysis: MarketAnalysis): Promise<any> {
    // Implementar análise de concorrência
    return {
      competitors: [],
      marketConcentration: 0,
    };
  }

  private async performTrendAnalysis(analysis: MarketAnalysis): Promise<any> {
    // Implementar análise de tendências
    return {
      trends: [],
    };
  }

  private async performOpportunityMapping(analysis: MarketAnalysis): Promise<any> {
    // Implementar mapeamento de oportunidades
    const opportunities = await this.tenderRepository.find({
      where: { isOpportunity: true, status: TenderStatus.OPEN },
      order: { relevanceScore: 'DESC' },
      take: 20,
    });

    return {
      highValueTenders: opportunities.map(tender => ({
        id: tender.id,
        title: tender.title,
        organization: tender.organizationName,
        value: tender.estimatedValue,
        deadline: tender.proposalDeadline,
        relevanceScore: tender.relevanceScore,
      })),
    };
  }

  private async performPriceAnalysis(analysis: MarketAnalysis): Promise<any> {
    // Implementar análise de preços
    return {
      averagePrices: [],
      priceVariation: 0,
    };
  }
}
