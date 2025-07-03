import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Between, In } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Notification, NotificationStatus, NotificationType, NotificationPriority, NotificationCategory } from './entities/notification.entity';
import { NotificationTemplate } from './entities/notification-template.entity';
import { CreateNotificationDto, CreateBulkNotificationDto, CreateTemplateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

export interface NotificationFilters {
  userId?: string;
  type?: NotificationType[];
  status?: NotificationStatus[];
  priority?: NotificationPriority[];
  category?: NotificationCategory[];
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface NotificationStats {
  total: number;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
  pending: number;
  deliveryRate: number;
  readRate: number;
  byType: Record<NotificationType, number>;
  byCategory: Record<NotificationCategory, number>;
  byPriority: Record<NotificationPriority, number>;
  recentActivity: Array<{
    date: string;
    sent: number;
    delivered: number;
    read: number;
  }>;
}

@Injectable()
export class NotificationsService {
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
      expiresAt: createNotificationDto.expiresAt ? new Date(createNotificationDto.expiresAt) : null,
    });

    const savedNotification = await this.notificationRepository.save(notification);

    // Se for para envio imediato, processar
    if (!createNotificationDto.scheduledAt || new Date(createNotificationDto.scheduledAt) <= new Date()) {
      this.processNotification(savedNotification.id);
    }

    return savedNotification;
  }

  async createBulk(createBulkDto: CreateBulkNotificationDto): Promise<Notification[]> {
    const notifications = createBulkDto.userIds.map(userId => 
      this.notificationRepository.create({
        ...createBulkDto,
        userId,
        scheduledAt: createBulkDto.scheduledAt ? new Date(createBulkDto.scheduledAt) : new Date(),
        expiresAt: createBulkDto.expiresAt ? new Date(createBulkDto.expiresAt) : null,
      })
    );

    const savedNotifications = await this.notificationRepository.save(notifications);

    // Processar notificações imediatas
    if (!createBulkDto.scheduledAt || new Date(createBulkDto.scheduledAt) <= new Date()) {
      savedNotifications.forEach(notification => {
        this.processNotification(notification.id);
      });
    }

    return savedNotifications;
  }

  async createFromTemplate(createTemplateDto: CreateTemplateNotificationDto): Promise<Notification> {
    const template = await this.templateRepository.findOne({
      where: { id: createTemplateDto.templateId, isActive: true }
    });

    if (!template) {
      throw new NotFoundException('Template não encontrado ou inativo');
    }

    // Validar variáveis
    const validation = template.validateVariables(createTemplateDto.variables);
    if (!validation.valid) {
      throw new BadRequestException(`Variáveis inválidas: ${validation.errors.join(', ')}`);
    }

    // Renderizar template
    const message = template.renderTemplate(createTemplateDto.variables);
    const subject = template.subject ? template.renderTemplate(createTemplateDto.variables) : undefined;
    const htmlContent = template.htmlTemplate ? template.renderHtmlTemplate(createTemplateDto.variables) : undefined;

    const notificationData: any = {
      title: subject || template.name,
      message,
      type: template.type,
      category: template.category,
      userId: createTemplateDto.userId,
      data: {
        templateId: template.id,
        variables: createTemplateDto.variables,
        ...(htmlContent && { html: htmlContent }),
        ...template.config,
      },
      scheduledAt: createTemplateDto.scheduledAt ? new Date(createTemplateDto.scheduledAt) : new Date(),
      metadata: {
        ...createTemplateDto.metadata,
        template: template.name,
      },
    };

    return this.create(notificationData);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters: NotificationFilters = {},
  ): Promise<{
    notifications: Notification[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const whereConditions: any = {};

    if (filters.userId) {
      whereConditions.userId = filters.userId;
    }

    if (filters.type?.length) {
      whereConditions.type = In(filters.type);
    }

    if (filters.status?.length) {
      whereConditions.status = In(filters.status);
    }

    if (filters.priority?.length) {
      whereConditions.priority = In(filters.priority);
    }

    if (filters.category?.length) {
      whereConditions.category = In(filters.category);
    }

    if (filters.dateFrom || filters.dateTo) {
      whereConditions.createdAt = Between(
        filters.dateFrom || new Date('1970-01-01'),
        filters.dateTo || new Date(),
      );
    }

    const options: FindManyOptions<Notification> = {
      where: whereConditions,
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    };

    const [notifications, total] = await this.notificationRepository.findAndCount(options);

    return {
      notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!notification) {
      throw new NotFoundException(`Notificação com ID ${id} não encontrada`);
    }

    return notification;
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    const notification = await this.findOne(id);
    
    await this.notificationRepository.update(id, {
      ...updateNotificationDto,
      ...(updateNotificationDto.sentAt && { sentAt: new Date(updateNotificationDto.sentAt) }),
      ...(updateNotificationDto.deliveredAt && { deliveredAt: new Date(updateNotificationDto.deliveredAt) }),
      ...(updateNotificationDto.readAt && { readAt: new Date(updateNotificationDto.readAt) }),
      ...(updateNotificationDto.failedAt && { failedAt: new Date(updateNotificationDto.failedAt) }),
    });
    
    return this.findOne(id);
  }

  async markAsRead(id: string): Promise<Notification> {
    return this.update(id, {
      status: NotificationStatus.READ,
      readAt: new Date().toISOString(),
    });
  }

  async markAsDelivered(id: string): Promise<Notification> {
    return this.update(id, {
      status: NotificationStatus.DELIVERED,
      deliveredAt: new Date().toISOString(),
    });
  }

  async markAsFailed(id: string, errorMessage: string, errorDetails?: any): Promise<Notification> {
    const notification = await this.findOne(id);
    
    const updateData: any = {
      status: NotificationStatus.FAILED,
      failedAt: new Date().toISOString(),
      errorMessage,
      errorDetails,
      retryCount: notification.retryCount + 1,
    };

    // Calcular próximo retry se ainda puder tentar
    if (notification.canRetry()) {
      const delay = notification.getNextRetryDelay();
      updateData.nextRetryAt = new Date(Date.now() + delay).toISOString();
    }

    return this.update(id, updateData);
  }

  async remove(id: string): Promise<void> {
    const result = await this.notificationRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Notificação com ID ${id} não encontrada`);
    }
  }

  async getStats(userId?: string): Promise<NotificationStats> {
    const whereConditions: any = {};
    if (userId) {
      whereConditions.userId = userId;
    }

    const notifications = await this.notificationRepository.find({
      where: whereConditions,
    });

    const total = notifications.length;
    const sent = notifications.filter(n => n.status === NotificationStatus.SENT).length;
    const delivered = notifications.filter(n => n.status === NotificationStatus.DELIVERED).length;
    const read = notifications.filter(n => n.status === NotificationStatus.READ).length;
    const failed = notifications.filter(n => n.status === NotificationStatus.FAILED).length;
    const pending = notifications.filter(n => n.status === NotificationStatus.PENDING).length;

    const deliveryRate = sent > 0 ? (delivered / sent) * 100 : 0;
    const readRate = delivered > 0 ? (read / delivered) * 100 : 0;

    // Estatísticas por tipo
    const byType = Object.values(NotificationType).reduce((acc, type) => {
      acc[type] = notifications.filter(n => n.type === type).length;
      return acc;
    }, {} as Record<NotificationType, number>);

    // Estatísticas por categoria
    const byCategory = Object.values(NotificationCategory).reduce((acc, category) => {
      acc[category] = notifications.filter(n => n.category === category).length;
      return acc;
    }, {} as Record<NotificationCategory, number>);

    // Estatísticas por prioridade
    const byPriority = Object.values(NotificationPriority).reduce((acc, priority) => {
      acc[priority] = notifications.filter(n => n.priority === priority).length;
      return acc;
    }, {} as Record<NotificationPriority, number>);

    // Atividade recente (últimos 7 dias)
    const recentActivity = this.calculateRecentActivity(notifications);

    return {
      total,
      sent,
      delivered,
      read,
      failed,
      pending,
      deliveryRate,
      readRate,
      byType,
      byCategory,
      byPriority,
      recentActivity,
    };
  }

  async getUserNotifications(userId: string, limit: number = 20): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: { 
        userId, 
        status: In([NotificationStatus.PENDING, NotificationStatus.SENT, NotificationStatus.DELIVERED])
      },
    });
  }

  // Processar notificação (mock - aqui seria integração real)
  private async processNotification(notificationId: string): Promise<void> {
    try {
      const notification = await this.findOne(notificationId);
      
      // Simular processamento baseado no tipo
      switch (notification.type) {
        case NotificationType.EMAIL:
          await this.sendEmail(notification);
          break;
        case NotificationType.SMS:
          await this.sendSms(notification);
          break;
        case NotificationType.WHATSAPP:
          await this.sendWhatsApp(notification);
          break;
        case NotificationType.PUSH:
          await this.sendPush(notification);
          break;
        case NotificationType.IN_APP:
          await this.markAsDelivered(notificationId);
          break;
      }
    } catch (error) {
      await this.markAsFailed(notificationId, error.message, error);
    }
  }

  // Mock de envio de email
  private async sendEmail(notification: Notification): Promise<void> {
    // Aqui seria a integração com SendGrid, SES, etc.
    console.log(`Enviando email para ${notification.data?.emailTo || notification.user?.email}`);
    
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await this.update(notification.id, {
      status: NotificationStatus.SENT,
      sentAt: new Date().toISOString(),
    });

    // Simular entrega
    setTimeout(async () => {
      await this.markAsDelivered(notification.id);
    }, 2000);
  }

  // Mock de envio de SMS
  private async sendSms(notification: Notification): Promise<void> {
    console.log(`Enviando SMS para ${notification.data?.phoneNumber}`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await this.update(notification.id, {
      status: NotificationStatus.SENT,
      sentAt: new Date().toISOString(),
    });

    setTimeout(async () => {
      await this.markAsDelivered(notification.id);
    }, 1000);
  }

  // Mock de envio de WhatsApp
  private async sendWhatsApp(notification: Notification): Promise<void> {
    console.log(`Enviando WhatsApp para ${notification.data?.phoneNumber}`);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    await this.update(notification.id, {
      status: NotificationStatus.SENT,
      sentAt: new Date().toISOString(),
    });

    setTimeout(async () => {
      await this.markAsDelivered(notification.id);
    }, 3000);
  }

  // Mock de push notification
  private async sendPush(notification: Notification): Promise<void> {
    console.log(`Enviando push para ${notification.data?.deviceToken || notification.userId}`);
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    await this.update(notification.id, {
      status: NotificationStatus.SENT,
      sentAt: new Date().toISOString(),
    });

    setTimeout(async () => {
      await this.markAsDelivered(notification.id);
    }, 500);
  }

  // Cron job para processar notificações agendadas
  @Cron(CronExpression.EVERY_MINUTE)
  async processScheduledNotifications(): Promise<void> {
    const now = new Date();
    
    const scheduledNotifications = await this.notificationRepository.find({
      where: {
        status: NotificationStatus.PENDING,
        scheduledAt: Between(new Date(now.getTime() - 60000), now), // Últimos 1 minuto
      },
    });

    for (const notification of scheduledNotifications) {
      if (!notification.isExpired()) {
        this.processNotification(notification.id);
      }
    }
  }

  // Cron job para retry de notificações falhadas
  @Cron(CronExpression.EVERY_5_MINUTES)
  async retryFailedNotifications(): Promise<void> {
    const now = new Date();
    
    const failedNotifications = await this.notificationRepository.find({
      where: {
        status: NotificationStatus.FAILED,
        nextRetryAt: Between(new Date(now.getTime() - 300000), now), // Últimos 5 minutos
      },
    });

    for (const notification of failedNotifications) {
      if (notification.canRetry()) {
        this.processNotification(notification.id);
      }
    }
  }

  private calculateRecentActivity(notifications: Notification[]) {
    const days = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayNotifications = notifications.filter(n => 
        n.createdAt.toISOString().split('T')[0] === dateStr
      );
      
      days.push({
        date: dateStr,
        sent: dayNotifications.filter(n => n.status === NotificationStatus.SENT).length,
        delivered: dayNotifications.filter(n => n.status === NotificationStatus.DELIVERED).length,
        read: dayNotifications.filter(n => n.status === NotificationStatus.READ).length,
      });
    }
    
    return days;
  }
}
