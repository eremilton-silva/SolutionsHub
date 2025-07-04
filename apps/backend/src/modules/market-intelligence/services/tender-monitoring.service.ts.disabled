import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TenderMonitoring, MonitoringStatus } from '../entities/tender-monitoring.entity';
import { Tender } from '../entities/tender.entity';
import { PncpService } from './pncp.service';

@Injectable()
export class TenderMonitoringService {
  private readonly logger = new Logger(TenderMonitoringService.name);

  constructor(
    @InjectRepository(TenderMonitoring)
    private monitoringRepository: Repository<TenderMonitoring>,
    @InjectRepository(Tender)
    private tenderRepository: Repository<Tender>,
    private pncpService: PncpService,
  ) {}

  async createMonitoring(userId: string, monitoringData: Partial<TenderMonitoring>): Promise<TenderMonitoring> {
    const monitoring = this.monitoringRepository.create({
      ...monitoringData,
      userId,
    });

    return this.monitoringRepository.save(monitoring);
  }

  async getUserMonitorings(userId: string): Promise<TenderMonitoring[]> {
    return this.monitoringRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async updateMonitoring(id: string, userId: string, updateData: Partial<TenderMonitoring>): Promise<TenderMonitoring> {
    await this.monitoringRepository.update({ id, userId }, updateData);
    const monitoring = await this.monitoringRepository.findOne({ where: { id, userId } });
    if (!monitoring) {
      throw new Error('Monitoring not found');
    }
    return monitoring;
  }

  async deleteMonitoring(id: string, userId: string): Promise<void> {
    await this.monitoringRepository.delete({ id, userId });
  }

  async pauseMonitoring(id: string, userId: string): Promise<TenderMonitoring> {
    return this.updateMonitoring(id, userId, { status: MonitoringStatus.PAUSED });
  }

  async resumeMonitoring(id: string, userId: string): Promise<TenderMonitoring> {
    return this.updateMonitoring(id, userId, { status: MonitoringStatus.ACTIVE });
  }

  // Executar monitoramento a cada 30 minutos
  @Cron('0 */30 * * * *')
  async runScheduledMonitoring() {
    this.logger.log('Starting scheduled tender monitoring...');
    
    const activeMonitorings = await this.monitoringRepository.find({
      where: { status: MonitoringStatus.ACTIVE },
      relations: ['user'],
    });

    for (const monitoring of activeMonitorings) {
      try {
        await this.processMonitoring(monitoring);
      } catch (error) {
        this.logger.error(`Error processing monitoring ${monitoring.id}:`, error.message);
      }
    }

    this.logger.log(`Completed monitoring for ${activeMonitorings.length} active monitors`);
  }

  private async processMonitoring(monitoring: TenderMonitoring): Promise<void> {
    try {
      // Verificar se está no horário permitido para notificações
      if (!this.isNotificationTimeAllowed(monitoring)) {
        return;
      }

      // Buscar licitações no PNCP baseado nos filtros
      const searchParams = this.buildSearchParams(monitoring);
      const searchResult = await this.pncpService.searchTenders(searchParams);

      const newTenders: Tender[] = [];
      
      for (const pncpTender of searchResult.data) {
        // Verificar se já existe no banco
        const existingTender = await this.tenderRepository.findOne({
          where: { pncpId: pncpTender.numeroControlePNCP },
        });

        if (!existingTender) {
          // Mapear e salvar nova licitação
          const tenderData = this.pncpService.mapPncpToTender(pncpTender);
          const tender = this.tenderRepository.create({
            ...tenderData,
            isMonitored: true,
            relevanceScore: this.calculateRelevanceScore(pncpTender, monitoring),
          });

          const savedTender = await this.tenderRepository.save(tender);
          newTenders.push(savedTender);
        }
      }

      // Atualizar estatísticas do monitoramento
      await this.updateMonitoringStats(monitoring, newTenders);

      // Enviar notificações se houver novas licitações
      if (newTenders.length > 0 && monitoring.notifyOnNewTender) {
        await this.sendNotifications(monitoring, newTenders);
      }

    } catch (error) {
      this.logger.error(`Error in processMonitoring for ${monitoring.id}:`, error.message);
    }
  }

  private isNotificationTimeAllowed(monitoring: TenderMonitoring): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.toLocaleDateString('pt-BR', { weekday: 'long' }).toLowerCase();

    // Verificar dias da semana
    if (monitoring.notificationDays && monitoring.notificationDays.length > 0) {
      if (!monitoring.notificationDays.includes(currentDay)) {
        return false;
      }
    }

    // Verificar horário
    if (monitoring.notificationStartTime && monitoring.notificationEndTime) {
      const startHour = parseInt(monitoring.notificationStartTime.split(':')[0]);
      const endHour = parseInt(monitoring.notificationEndTime.split(':')[0]);
      
      if (currentHour < startHour || currentHour > endHour) {
        return false;
      }
    }

    return true;
  }

  private buildSearchParams(monitoring: TenderMonitoring): any {
    const params: any = {
      dataInicial: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Últimas 24h
      tamanhoPagina: 50,
    };

    // Filtros de organização
    if (monitoring.organizationFilters) {
      if (monitoring.organizationFilters.states?.length) {
        params.ufOrgao = monitoring.organizationFilters.states[0]; // PNCP aceita apenas uma UF por consulta
      }
    }

    // Filtros de valor
    if (monitoring.valueFilters) {
      if (monitoring.valueFilters.minValue) {
        params.valorMinimo = monitoring.valueFilters.minValue;
      }
      if (monitoring.valueFilters.maxValue) {
        params.valorMaximo = monitoring.valueFilters.maxValue;
      }
    }

    // Filtros de tipo/modalidade
    if (monitoring.typeFilters?.length) {
      // Mapear nossos tipos para códigos do PNCP
      params.codigoModalidade = this.mapTypeToModalidadeCode(monitoring.typeFilters[0]);
    }

    // Palavras-chave (termo de busca)
    if (monitoring.keywords?.length) {
      params.termo = monitoring.keywords.join(' ');
    }

    return params;
  }

  private mapTypeToModalidadeCode(type: string): number {
    const mapping = {
      'pregao_eletronico': 1,
      'pregao_presencial': 2,
      'concorrencia': 3,
      'tomada_precos': 4,
      'convite': 5,
      'concurso': 6,
      'leilao': 7,
      'rdc': 8,
      'dialogo_competitivo': 9,
    };

    return mapping[type] || 1;
  }

  private calculateRelevanceScore(pncpTender: any, monitoring: TenderMonitoring): number {
    let score = 0;

    // Score baseado em palavras-chave
    const tenderText = `${pncpTender.resumo} ${pncpTender.informacaoComplementar}`.toLowerCase();
    for (const keyword of monitoring.keywords) {
      if (tenderText.includes(keyword.toLowerCase())) {
        score += 20;
      }
    }

    // Score baseado no valor
    if (pncpTender.valorEstimadoTotal) {
      if (monitoring.valueFilters?.minValue && monitoring.valueFilters?.maxValue) {
        const targetRange = monitoring.valueFilters.maxValue - monitoring.valueFilters.minValue;
        const valuePosition = (pncpTender.valorEstimadoTotal - monitoring.valueFilters.minValue) / targetRange;
        score += Math.max(0, 30 - Math.abs(0.5 - valuePosition) * 60); // Máximo quando está no meio da faixa
      }
    }

    // Score baseado na organização
    if (monitoring.organizationFilters?.cnpjs?.includes(pncpTender.unidadeOrgao?.cnpj)) {
      score += 50;
    }

    return Math.min(100, Math.max(0, score));
  }

  private async updateMonitoringStats(monitoring: TenderMonitoring, newTenders: any[]): Promise<void> {
    const updateData: Partial<TenderMonitoring> = {
      totalTendersFound: monitoring.totalTendersFound + newTenders.length,
      lastResults: newTenders.slice(0, 10).map(tender => ({
        tenderId: tender.id,
        title: tender.title,
        organization: tender.organizationName,
        value: tender.estimatedValue,
        foundAt: new Date(),
      })),
    };

    if (newTenders.length > 0) {
      updateData.totalNotificationsSent = monitoring.totalNotificationsSent + 1;
      updateData.lastNotificationAt = new Date();
    }

    await this.monitoringRepository.update(monitoring.id, updateData);
  }

  private async sendNotifications(monitoring: TenderMonitoring, tenders: any[]): Promise<void> {
    // TODO: Implementar envio de notificações
    // Por email, WhatsApp, push notifications, etc.
    this.logger.log(`Would send notification for ${tenders.length} new tenders to user ${monitoring.userId}`);
    
    for (const channel of monitoring.notificationChannels) {
      switch (channel) {
        case 'email':
          // await this.emailService.sendTenderNotification(monitoring.user.email, tenders);
          break;
        case 'whatsapp':
          // await this.whatsappService.sendTenderNotification(monitoring.user.phone, tenders);
          break;
        case 'push':
          // await this.pushService.sendTenderNotification(monitoring.userId, tenders);
          break;
      }
    }
  }
}
