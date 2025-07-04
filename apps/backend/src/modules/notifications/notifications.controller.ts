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
  Request,
} from '@nestjs/common';
import { NotificationsService, NotificationFilters } from './notifications.service';
import { CreateNotificationDto, CreateBulkNotificationDto, CreateTemplateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationType, NotificationStatus, NotificationPriority, NotificationCategory } from './entities/notification.entity';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Post('bulk')
  createBulk(@Body() createBulkNotificationDto: CreateBulkNotificationDto) {
    return this.notificationsService.createBulk(createBulkNotificationDto);
  }

  @Post('from-template')
  createFromTemplate(@Body() createTemplateDto: CreateTemplateNotificationDto) {
    return this.notificationsService.createFromTemplate(createTemplateDto);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('userId') userId?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('category') category?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('search') search?: string,
  ) {
    const filters: NotificationFilters = {};

    if (userId) {
      filters.userId = userId;
    }

    if (type) {
      filters.type = type.split(',') as NotificationType[];
    }

    if (status) {
      filters.status = status.split(',') as NotificationStatus[];
    }

    if (priority) {
      filters.priority = priority.split(',') as NotificationPriority[];
    }

    if (category) {
      filters.category = category.split(',') as NotificationCategory[];
    }

    if (dateFrom) {
      filters.dateFrom = new Date(dateFrom);
    }

    if (dateTo) {
      filters.dateTo = new Date(dateTo);
    }

    if (search) {
      filters.search = search;
    }

    return this.notificationsService.findAll(page, limit, filters);
  }

  @Get('stats')
  getStats(@Query('userId') userId?: string) {
    return this.notificationsService.getStats(userId);
  }

  @Get('my-notifications')
  getMyNotifications(
    @Request() req,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.notificationsService.getUserNotifications(req.user.id, limit);
  }

  @Get('unread-count')
  getUnreadCount(@Request() req) {
    return this.notificationsService.getUnreadCount(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Patch(':id/mark-as-read')
  markAsRead(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch(':id/mark-as-delivered')
  markAsDelivered(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.markAsDelivered(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.remove(id);
  }
}
