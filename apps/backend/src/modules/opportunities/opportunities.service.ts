import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Like, Between } from 'typeorm';
import { Opportunity, OpportunityStatus, OpportunityPriority, OpportunitySource } from './entities/opportunity.entity';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';

export interface OpportunityFilters {
  status?: OpportunityStatus[];
  priority?: OpportunityPriority[];
  source?: OpportunitySource[];
  assignedUserId?: string;
  clientId?: string;
  estimatedValueMin?: number;
  estimatedValueMax?: number;
  probabilityMin?: number;
  probabilityMax?: number;
  expectedCloseDateFrom?: Date;
  expectedCloseDateTo?: Date;
  search?: string;
  tags?: string[];
  isOverdue?: boolean;
}

export interface OpportunityStats {
  totalOpportunities: number;
  totalValue: number;
  averageValue: number;
  winRate: number;
  conversionRate: number;
  averageDaysToClose: number;
  byStatus: Record<OpportunityStatus, number>;
  byPriority: Record<OpportunityPriority, number>;
  bySource: Record<OpportunitySource, number>;
  monthlyTrend: Array<{
    month: string;
    count: number;
    value: number;
    winRate: number;
  }>;
}

@Injectable()
export class OpportunitiesService {
  constructor(
    @InjectRepository(Opportunity)
    private opportunityRepository: Repository<Opportunity>,
  ) {}

  async create(createOpportunityDto: CreateOpportunityDto): Promise<Opportunity> {
    const opportunity = this.opportunityRepository.create(createOpportunityDto);
    
    // Adicionar timeline inicial
    opportunity.timeline = [{
      date: new Date(),
      event: 'opportunity_created',
      description: 'Oportunidade criada no sistema',
      userId: createOpportunityDto.assignedUserId,
    }];

    const savedOpportunity = await this.opportunityRepository.save(opportunity);
    await this.updateCalculatedFields(savedOpportunity.id);
    
    return this.findOne(savedOpportunity.id);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters: OpportunityFilters = {},
  ): Promise<{
    opportunities: Opportunity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const whereConditions: any = {};

    // Aplicar filtros
    if (filters.status?.length) {
      whereConditions.status = filters.status.length === 1 ? filters.status[0] : { $in: filters.status };
    }

    if (filters.priority?.length) {
      whereConditions.priority = filters.priority.length === 1 ? filters.priority[0] : { $in: filters.priority };
    }

    if (filters.source?.length) {
      whereConditions.source = filters.source.length === 1 ? filters.source[0] : { $in: filters.source };
    }

    if (filters.assignedUserId) {
      whereConditions.assignedUserId = filters.assignedUserId;
    }

    if (filters.clientId) {
      whereConditions.clientId = filters.clientId;
    }

    if (filters.estimatedValueMin !== undefined || filters.estimatedValueMax !== undefined) {
      whereConditions.estimatedValue = Between(
        filters.estimatedValueMin || 0,
        filters.estimatedValueMax || Number.MAX_SAFE_INTEGER,
      );
    }

    if (filters.probabilityMin !== undefined || filters.probabilityMax !== undefined) {
      whereConditions.probabilityPercent = Between(
        filters.probabilityMin || 0,
        filters.probabilityMax || 100,
      );
    }

    if (filters.expectedCloseDateFrom || filters.expectedCloseDateTo) {
      whereConditions.expectedCloseDate = Between(
        filters.expectedCloseDateFrom || new Date('1970-01-01'),
        filters.expectedCloseDateTo || new Date('2099-12-31'),
      );
    }

    if (filters.search) {
      whereConditions.title = Like(`%${filters.search}%`);
    }

    if (filters.isOverdue !== undefined) {
      whereConditions.isOverdue = filters.isOverdue;
    }

    const options: FindManyOptions<Opportunity> = {
      where: whereConditions,
      relations: ['client', 'assignedUser'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    };

    const [opportunities, total] = await this.opportunityRepository.findAndCount(options);

    return {
      opportunities,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Opportunity> {
    const opportunity = await this.opportunityRepository.findOne({
      where: { id },
      relations: ['client', 'assignedUser'],
    });

    if (!opportunity) {
      throw new NotFoundException(`Oportunidade com ID ${id} não encontrada`);
    }

    return opportunity;
  }

  async update(id: string, updateOpportunityDto: UpdateOpportunityDto): Promise<Opportunity> {
    const opportunity = await this.findOne(id);
    
    const updateData: any = { ...updateOpportunityDto };
    
    // Verificar se o status mudou para adicionar ao timeline
    if (updateOpportunityDto.status && updateOpportunityDto.status !== opportunity.status) {
      const timeline = opportunity.timeline || [];
      timeline.push({
        date: new Date(),
        event: 'status_changed',
        description: `Status alterado de ${opportunity.status} para ${updateOpportunityDto.status}`,
        userId: updateOpportunityDto.assignedUserId,
      });
      updateData.timeline = timeline;
    }

    // Se a oportunidade foi fechada (won/lost), definir data de fechamento
    if (updateOpportunityDto.status === OpportunityStatus.WON || 
        updateOpportunityDto.status === OpportunityStatus.LOST) {
      updateData.actualCloseDate = new Date();
    }

    await this.opportunityRepository.update(id, updateData);
    await this.updateCalculatedFields(id);
    
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.opportunityRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Oportunidade com ID ${id} não encontrada`);
    }
  }

  async getStats(filters: OpportunityFilters = {}): Promise<OpportunityStats> {
    const whereConditions: any = {};

    // Aplicar filtros básicos
    if (filters.assignedUserId) {
      whereConditions.assignedUserId = filters.assignedUserId;
    }

    if (filters.clientId) {
      whereConditions.clientId = filters.clientId;
    }

    const opportunities = await this.opportunityRepository.find({
      where: whereConditions,
    });

    const totalOpportunities = opportunities.length;
    const totalValue = opportunities.reduce((sum, opp) => sum + (opp.estimatedValue || 0), 0);
    const averageValue = totalOpportunities > 0 ? totalValue / totalOpportunities : 0;

    const closedOpportunities = opportunities.filter(opp => 
      opp.status === OpportunityStatus.WON || opp.status === OpportunityStatus.LOST
    );
    const wonOpportunities = opportunities.filter(opp => opp.status === OpportunityStatus.WON);
    
    const winRate = closedOpportunities.length > 0 ? 
      (wonOpportunities.length / closedOpportunities.length) * 100 : 0;
    
    const conversionRate = totalOpportunities > 0 ? 
      (wonOpportunities.length / totalOpportunities) * 100 : 0;

    const closedWithDates = closedOpportunities.filter(opp => 
      opp.createdAt && opp.actualCloseDate
    );
    const averageDaysToClose = closedWithDates.length > 0 ?
      closedWithDates.reduce((sum, opp) => {
        const days = Math.floor((opp.actualCloseDate.getTime() - opp.createdAt.getTime()) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0) / closedWithDates.length : 0;

    // Estatísticas por status
    const byStatus = Object.values(OpportunityStatus).reduce((acc, status) => {
      acc[status] = opportunities.filter(opp => opp.status === status).length;
      return acc;
    }, {} as Record<OpportunityStatus, number>);

    // Estatísticas por prioridade
    const byPriority = Object.values(OpportunityPriority).reduce((acc, priority) => {
      acc[priority] = opportunities.filter(opp => opp.priority === priority).length;
      return acc;
    }, {} as Record<OpportunityPriority, number>);

    // Estatísticas por fonte
    const bySource = Object.values(OpportunitySource).reduce((acc, source) => {
      acc[source] = opportunities.filter(opp => opp.source === source).length;
      return acc;
    }, {} as Record<OpportunitySource, number>);

    // Tendência mensal (últimos 12 meses)
    const monthlyTrend = this.calculateMonthlyTrend(opportunities);

    return {
      totalOpportunities,
      totalValue,
      averageValue,
      winRate,
      conversionRate,
      averageDaysToClose,
      byStatus,
      byPriority,
      bySource,
      monthlyTrend,
    };
  }

  async addTimelineEvent(
    id: string, 
    event: string, 
    description?: string, 
    userId?: string
  ): Promise<Opportunity> {
    const opportunity = await this.findOne(id);
    
    const timeline = opportunity.timeline || [];
    timeline.push({
      date: new Date(),
      event,
      description,
      userId,
    });

    await this.opportunityRepository.update(id, { timeline });
    return this.findOne(id);
  }

  async updateProbability(id: string, probability: number): Promise<Opportunity> {
    if (probability < 0 || probability > 100) {
      throw new BadRequestException('Probabilidade deve estar entre 0 e 100');
    }

    await this.opportunityRepository.update(id, { probabilityPercent: probability });
    await this.updateCalculatedFields(id);
    
    return this.findOne(id);
  }

  async getUpcomingFollowUps(userId?: string): Promise<Opportunity[]> {
    const whereConditions: any = {
      nextFollowUpDate: Between(new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // Próximos 7 dias
    };

    if (userId) {
      whereConditions.assignedUserId = userId;
    }

    return this.opportunityRepository.find({
      where: whereConditions,
      relations: ['client', 'assignedUser'],
      order: { nextFollowUpDate: 'ASC' },
    });
  }

  async getOverdueOpportunities(userId?: string): Promise<Opportunity[]> {
    const whereConditions: any = {
      isOverdue: true,
    };

    if (userId) {
      whereConditions.assignedUserId = userId;
    }

    return this.opportunityRepository.find({
      where: whereConditions,
      relations: ['client', 'assignedUser'],
      order: { expectedCloseDate: 'ASC' },
    });
  }

  private async updateCalculatedFields(id: string): Promise<void> {
    const opportunity = await this.opportunityRepository.findOne({ where: { id } });
    if (!opportunity) return;

    const now = new Date();
    const createdAt = opportunity.createdAt;
    const expectedCloseDate = opportunity.expectedCloseDate;

    // Calcular dias no estágio atual
    const lastStatusChange = opportunity.timeline?.find(t => t.event === 'status_changed');
    const stageStartDate = lastStatusChange ? new Date(lastStatusChange.date) : createdAt;
    const daysInStage = Math.floor((now.getTime() - stageStartDate.getTime()) / (1000 * 60 * 60 * 24));

    // Calcular dias para fechamento
    const daysToClose = expectedCloseDate ? 
      Math.floor((expectedCloseDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;

    // Verificar se está atrasada
    const isOverdue = expectedCloseDate ? now > expectedCloseDate : false;

    await this.opportunityRepository.update(id, {
      daysInStage,
      daysToClose,
      isOverdue,
    });
  }

  private calculateMonthlyTrend(opportunities: Opportunity[]): Array<{
    month: string;
    count: number;
    value: number;
    winRate: number;
  }> {
    const months: Array<{
      month: string;
      count: number;
      value: number;
      winRate: number;
    }> = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
      
      const monthOpportunities = opportunities.filter(opp => {
        const oppDate = new Date(opp.createdAt);
        return oppDate.getFullYear() === date.getFullYear() && 
               oppDate.getMonth() === date.getMonth();
      });

      const monthClosed = monthOpportunities.filter(opp => 
        opp.status === OpportunityStatus.WON || opp.status === OpportunityStatus.LOST
      );
      
      const monthWon = monthOpportunities.filter(opp => opp.status === OpportunityStatus.WON);
      
      months.push({
        month: monthKey,
        count: monthOpportunities.length,
        value: monthOpportunities.reduce((sum, opp) => sum + (opp.estimatedValue || 0), 0),
        winRate: monthClosed.length > 0 ? (monthWon.length / monthClosed.length) * 100 : 0,
      });
    }
    
    return months;
  }
}
