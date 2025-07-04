import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationStatus, NotificationType, NotificationPriority } from './entities/notification.entity';
import { NotificationTemplate } from './entities/notification-template.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

export interface NotificationFilters {
  userId?: string;
  type?: NotificationType | NotificationType[];
  status?: NotificationStatus | NotificationStatus[];
  priority?: NotificationPriority | NotificationPriority[];
  category?: any; // NotificationCategory or NotificationCategory[]
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(NotificationTemplate)
    private templateRepository: Repository<NotificationTemplate>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create({
      ...createNotificationDto,
      scheduledAt: createNotificationDto.scheduledAt ? new Date(createNotificationDto.scheduledAt) : new Date(),
      expiresAt: createNotificationDto.expiresAt ? new Date(createNotificationDto.expiresAt) : undefined,
    });

    const saved = await this.notificationRepository.save(notification);
    this.logger.log(`Created notification ${saved.id} for user ${saved.userId}`);
    
    return saved;
  }

  async findAll(page: number = 1, limit: number = 20, filters?: NotificationFilters): Promise<{
    notifications: Notification[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    const queryBuilder = this.notificationRepository.createQueryBuilder('notification');

    // Apply filters
    if (filters?.userId) {
      queryBuilder.andWhere('notification.userId = :userId', { userId: filters.userId });
    }
    if (filters?.type) {
      queryBuilder.andWhere('notification.type = :type', { type: filters.type });
    }
    if (filters?.status) {
      queryBuilder.andWhere('notification.status = :status', { status: filters.status });
    }
    if (filters?.priority) {
      queryBuilder.andWhere('notification.priority = :priority', { priority: filters.priority });
    }

    const [notifications, total] = await queryBuilder
      .orderBy('notification.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      notifications,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return notification;
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    await this.notificationRepository.update(id, updateNotificationDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.notificationRepository.delete(id);
    this.logger.log(`Deleted notification ${id}`);
  }

  async markAsRead(id: string): Promise<Notification> {
    await this.notificationRepository.update(id, {
      status: NotificationStatus.READ,
      readAt: new Date(),
    });
    return this.findOne(id);
  }

  async markAsDelivered(id: string): Promise<Notification> {
    await this.notificationRepository.update(id, {
      status: NotificationStatus.DELIVERED,
      deliveredAt: new Date(),
    });
    return this.findOne(id);
  }

  // Métodos simplificados para satisfazer o controller
  async createFromTemplate(createTemplateDto: any): Promise<Notification> {
    // Implementação simplificada
    return this.create({
      userId: createTemplateDto.userId || 'user-id',
      title: createTemplateDto.title || 'Template Notification',
      message: createTemplateDto.message || 'Default message',
      type: NotificationType.SYSTEM,
      priority: NotificationPriority.MEDIUM,
      category: createTemplateDto.category || 'system_update' as any,
    });
  }

  async getUserNotifications(userId: string, limit: number = 50): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getUnreadCount(userId: string): Promise<{ count: number }> {
    const count = await this.notificationRepository.count({
      where: { 
        userId, 
        status: NotificationStatus.PENDING 
      },
    });

    return { count };
  }

  async getStats(userId?: string): Promise<any> {
    let query = this.notificationRepository.createQueryBuilder('notification');
    
    if (userId) {
      query = query.where('notification.userId = :userId', { userId });
    }

    const total = await query.getCount();
    
    const sent = await query.clone().andWhere('notification.status = :status', { status: NotificationStatus.SENT }).getCount();
    const failed = await query.clone().andWhere('notification.status = :status', { status: NotificationStatus.FAILED }).getCount();

    return {
      total,
      sent,
      failed,
      pending: total - sent - failed,
      recentActivity: [],
    };
  }

  async createBulk(createBulkDto: any): Promise<Notification[]> {
    // Implementação simplificada
    const notifications: Notification[] = [];
    for (const notificationData of createBulkDto.notifications || []) {
      const notification = await this.create({
        userId: notificationData.userId,
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type || NotificationType.SYSTEM,
        priority: notificationData.priority || NotificationPriority.MEDIUM,
        category: notificationData.category || 'system_update' as any,
      });
      notifications.push(notification);
    }
    return notifications;
  }
}
