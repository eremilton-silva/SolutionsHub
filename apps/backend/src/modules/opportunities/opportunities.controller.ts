import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OpportunitiesService, OpportunityFilters } from './opportunities.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OpportunityStatus, OpportunityPriority, OpportunitySource } from './entities/opportunity.entity';

@Controller('opportunities')
@UseGuards(JwtAuthGuard)
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Post()
  create(@Body() createOpportunityDto: CreateOpportunityDto) {
    return this.opportunitiesService.create(createOpportunityDto);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('source') source?: string,
    @Query('assignedUserId') assignedUserId?: string,
    @Query('clientId') clientId?: string,
    @Query('estimatedValueMin') estimatedValueMin?: number,
    @Query('estimatedValueMax') estimatedValueMax?: number,
    @Query('probabilityMin') probabilityMin?: number,
    @Query('probabilityMax') probabilityMax?: number,
    @Query('expectedCloseDateFrom') expectedCloseDateFrom?: string,
    @Query('expectedCloseDateTo') expectedCloseDateTo?: string,
    @Query('search') search?: string,
    @Query('tags') tags?: string,
    @Query('isOverdue') isOverdue?: boolean,
  ) {
    const filters: OpportunityFilters = {};

    if (status) {
      filters.status = status.split(',') as OpportunityStatus[];
    }

    if (priority) {
      filters.priority = priority.split(',') as OpportunityPriority[];
    }

    if (source) {
      filters.source = source.split(',') as OpportunitySource[];
    }

    if (assignedUserId) {
      filters.assignedUserId = assignedUserId;
    }

    if (clientId) {
      filters.clientId = clientId;
    }

    if (estimatedValueMin !== undefined) {
      filters.estimatedValueMin = estimatedValueMin;
    }

    if (estimatedValueMax !== undefined) {
      filters.estimatedValueMax = estimatedValueMax;
    }

    if (probabilityMin !== undefined) {
      filters.probabilityMin = probabilityMin;
    }

    if (probabilityMax !== undefined) {
      filters.probabilityMax = probabilityMax;
    }

    if (expectedCloseDateFrom) {
      filters.expectedCloseDateFrom = new Date(expectedCloseDateFrom);
    }

    if (expectedCloseDateTo) {
      filters.expectedCloseDateTo = new Date(expectedCloseDateTo);
    }

    if (search) {
      filters.search = search;
    }

    if (tags) {
      filters.tags = tags.split(',');
    }

    if (isOverdue !== undefined) {
      filters.isOverdue = isOverdue;
    }

    return this.opportunitiesService.findAll(page, limit, filters);
  }

  @Get('stats')
  getStats(
    @Query('assignedUserId') assignedUserId?: string,
    @Query('clientId') clientId?: string,
  ) {
    const filters: OpportunityFilters = {};

    if (assignedUserId) {
      filters.assignedUserId = assignedUserId;
    }

    if (clientId) {
      filters.clientId = clientId;
    }

    return this.opportunitiesService.getStats(filters);
  }

  @Get('upcoming-follow-ups')
  getUpcomingFollowUps(@Query('userId') userId?: string) {
    return this.opportunitiesService.getUpcomingFollowUps(userId);
  }

  @Get('overdue')
  getOverdueOpportunities(@Query('userId') userId?: string) {
    return this.opportunitiesService.getOverdueOpportunities(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.opportunitiesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOpportunityDto: UpdateOpportunityDto,
  ) {
    return this.opportunitiesService.update(id, updateOpportunityDto);
  }

  @Patch(':id/probability')
  updateProbability(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('probability', ParseIntPipe) probability: number,
  ) {
    return this.opportunitiesService.updateProbability(id, probability);
  }

  @Post(':id/timeline')
  addTimelineEvent(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() eventData: { event: string; description?: string; userId?: string },
  ) {
    return this.opportunitiesService.addTimelineEvent(
      id,
      eventData.event,
      eventData.description,
      eventData.userId,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.opportunitiesService.remove(id);
  }
}
