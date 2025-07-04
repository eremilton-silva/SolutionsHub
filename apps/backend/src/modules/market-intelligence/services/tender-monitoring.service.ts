import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenderMonitoring, MonitoringStatus, NotificationChannel } from '../entities/tender-monitoring.entity';
import { Tender } from '../entities/tender.entity';

export interface MonitoringCreateDto {
  name: string;
  description?: string;
  userId: string;
  keywords: string[];
  organizationFilters?: {
    cnpjs?: string[];
    municipalities?: string[];
    states?: string[];
    excludeCnpjs?: string[];
  };
  valueFilters?: {
    minValue?: number;
    maxValue?: number;
  };
  typeFilters?: string[];
  categoryFilters?: string[];
  notificationChannels?: NotificationChannel[];
}

export interface MonitoringUpdateDto extends Partial<MonitoringCreateDto> {
  status?: MonitoringStatus;
}

@Injectable()
export class TenderMonitoringService {
  private readonly logger = new Logger(TenderMonitoringService.name);

  constructor(
    @InjectRepository(TenderMonitoring)
    private tenderMonitoringRepository: Repository<TenderMonitoring>,
    @InjectRepository(Tender)
    private tenderRepository: Repository<Tender>,
  ) {}

  async create(createDto: MonitoringCreateDto): Promise<TenderMonitoring> {
    const monitoring = this.tenderMonitoringRepository.create({
      ...createDto,
      status: MonitoringStatus.ACTIVE,
      notificationChannels: createDto.notificationChannels || [NotificationChannel.EMAIL],
      notifyOnNewTender: true,
      notifyOnStatusChange: true,
      notifyOnDeadlineApproach: false,
      deadlineNotificationHours: 24,
      totalNotificationsSent: 0,
      totalTendersFound: 0,
    });

    const saved = await this.tenderMonitoringRepository.save(monitoring);
    this.logger.log(`Created monitoring ${saved.id} for user ${createDto.userId}`);
    
    return saved;
  }

  async findByUserId(userId: string): Promise<TenderMonitoring[]> {
    return this.tenderMonitoringRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findActiveByUserId(userId: string): Promise<TenderMonitoring[]> {
    return this.tenderMonitoringRepository.find({
      where: { userId, status: MonitoringStatus.ACTIVE },
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(): Promise<TenderMonitoring[]> {
    return this.tenderMonitoringRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<TenderMonitoring | null> {
    return this.tenderMonitoringRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updateDto: MonitoringUpdateDto): Promise<TenderMonitoring | null> {
    await this.tenderMonitoringRepository.update(id, updateDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.tenderMonitoringRepository.delete(id);
    this.logger.log(`Deleted monitoring ${id}`);
  }

  async activate(id: string): Promise<TenderMonitoring | null> {
    await this.tenderMonitoringRepository.update(id, { 
      status: MonitoringStatus.ACTIVE,
    });
    return this.findById(id);
  }

  async deactivate(id: string): Promise<TenderMonitoring | null> {
    await this.tenderMonitoringRepository.update(id, { 
      status: MonitoringStatus.PAUSED,
    });
    return this.findById(id);
  }

  async checkTenderMatches(tender: Tender): Promise<TenderMonitoring[]> {
    const activeMonitorings = await this.tenderMonitoringRepository.find({
      where: { status: MonitoringStatus.ACTIVE },
    });

    const matches: TenderMonitoring[] = [];

    for (const monitoring of activeMonitorings) {
      if (this.matchesCriteria(tender, monitoring)) {
        matches.push(monitoring);
      }
    }

    return matches;
  }

  private matchesCriteria(tender: Tender, monitoring: TenderMonitoring): boolean {
    // Check keywords
    if (monitoring.keywords && monitoring.keywords.length > 0) {
      const searchText = `${tender.title} ${tender.description} ${tender.observations}`.toLowerCase();
      const hasKeywordMatch = monitoring.keywords.some(keyword => 
        searchText.includes(keyword.toLowerCase())
      );
      if (!hasKeywordMatch) return false;
    }

    // Check organization filters
    if (monitoring.organizationFilters) {
      const { states, municipalities, cnpjs, excludeCnpjs } = monitoring.organizationFilters;
      
      if (states && states.length > 0 && tender.organizationState) {
        if (!states.includes(tender.organizationState)) return false;
      }

      if (municipalities && municipalities.length > 0 && tender.organizationMunicipality) {
        if (!municipalities.includes(tender.organizationMunicipality)) return false;
      }

      if (cnpjs && cnpjs.length > 0 && tender.organizationCnpj) {
        if (!cnpjs.includes(tender.organizationCnpj)) return false;
      }

      if (excludeCnpjs && excludeCnpjs.length > 0 && tender.organizationCnpj) {
        if (excludeCnpjs.includes(tender.organizationCnpj)) return false;
      }
    }

    // Check value range
    if (monitoring.valueFilters) {
      const { minValue, maxValue } = monitoring.valueFilters;
      
      if (minValue && tender.estimatedValue < minValue) {
        return false;
      }

      if (maxValue && tender.estimatedValue > maxValue) {
        return false;
      }
    }

    // Check type filters
    if (monitoring.typeFilters && monitoring.typeFilters.length > 0) {
      if (!monitoring.typeFilters.includes(tender.type)) return false;
    }

    // Check category filters (using tender type as category for now)
    if (monitoring.categoryFilters && monitoring.categoryFilters.length > 0) {
      if (!monitoring.categoryFilters.includes(tender.type)) return false;
    }

    return true;
  }

  async getStatistics(userId?: string): Promise<any> {
    const queryBuilder = this.tenderMonitoringRepository.createQueryBuilder('monitoring');

    if (userId) {
      queryBuilder.where('monitoring.userId = :userId', { userId });
    }

    const total = await queryBuilder.getCount();
    
    queryBuilder.andWhere('monitoring.status = :status', { status: MonitoringStatus.ACTIVE });
    const active = await queryBuilder.getCount();

    return {
      total,
      active,
      inactive: total - active,
    };
  }

  async getUserMonitorings(userId: string): Promise<TenderMonitoring[]> {
    return this.findByUserId(userId);
  }

  async createMonitoring(userId: string, monitoringData: Partial<MonitoringCreateDto>): Promise<TenderMonitoring> {
    const createDto: MonitoringCreateDto = {
      name: monitoringData.name || 'New Monitoring',
      userId,
      keywords: monitoringData.keywords || [],
      ...monitoringData,
    };
    return this.create(createDto);
  }

  async updateMonitoring(id: string, userId: string, updateData: MonitoringUpdateDto): Promise<TenderMonitoring | null> {
    // Verificar se o monitoring pertence ao usuário
    const monitoring = await this.findById(id);
    if (monitoring?.userId !== userId) {
      throw new Error('Unauthorized');
    }
    return this.update(id, updateData);
  }

  async deleteMonitoring(id: string, userId: string): Promise<void> {
    // Verificar se o monitoring pertence ao usuário
    const monitoring = await this.findById(id);
    if (monitoring?.userId !== userId) {
      throw new Error('Unauthorized');
    }
    return this.delete(id);
  }

  async pauseMonitoring(id: string, userId: string): Promise<TenderMonitoring | null> {
    // Verificar se o monitoring pertence ao usuário
    const monitoring = await this.findById(id);
    if (monitoring?.userId !== userId) {
      throw new Error('Unauthorized');
    }
    return this.deactivate(id);
  }

  async resumeMonitoring(id: string, userId: string): Promise<TenderMonitoring | null> {
    // Verificar se o monitoring pertence ao usuário
    const monitoring = await this.findById(id);
    if (monitoring?.userId !== userId) {
      throw new Error('Unauthorized');
    }
    return this.activate(id);
  }
}
