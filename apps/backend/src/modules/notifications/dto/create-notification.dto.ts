import { IsString, IsEnum, IsOptional, IsObject, IsDateString, IsNumber, IsArray, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationType, NotificationPriority, NotificationCategory } from '../entities/notification.entity';

export class CreateNotificationDto {
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsEnum(NotificationPriority)
  @IsOptional()
  priority?: NotificationPriority;

  @IsEnum(NotificationCategory)
  category: NotificationCategory;

  @IsString()
  userId: string;

  @IsObject()
  @IsOptional()
  data?: Record<string, any>;

  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @IsNumber()
  @IsOptional()
  maxRetries?: number;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class CreateBulkNotificationDto {
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsEnum(NotificationPriority)
  @IsOptional()
  priority?: NotificationPriority;

  @IsEnum(NotificationCategory)
  category: NotificationCategory;

  @IsArray()
  @IsString({ each: true })
  userIds: string[];

  @IsObject()
  @IsOptional()
  data?: Record<string, any>;

  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @IsNumber()
  @IsOptional()
  maxRetries?: number;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class CreateTemplateNotificationDto {
  @IsString()
  templateId: string;

  @IsString()
  userId: string;

  @IsObject()
  variables: Record<string, any>;

  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class SendEmailNotificationDto {
  @IsString()
  to: string;

  @IsString()
  @IsOptional()
  from?: string;

  @IsString()
  subject: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  html?: string;

  @IsString()
  @IsOptional()
  templateId?: string;

  @IsObject()
  @IsOptional()
  variables?: Record<string, any>;

  @IsEnum(NotificationPriority)
  @IsOptional()
  priority?: NotificationPriority;

  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class SendSmsNotificationDto {
  @IsString()
  phoneNumber: string;

  @IsString()
  message: string;

  @IsString()
  @IsOptional()
  senderId?: string;

  @IsEnum(NotificationPriority)
  @IsOptional()
  priority?: NotificationPriority;

  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class SendWhatsAppNotificationDto {
  @IsString()
  phoneNumber: string;

  @IsString()
  message: string;

  @IsString()
  @IsOptional()
  templateName?: string;

  @IsObject()
  @IsOptional()
  templateParams?: Record<string, any>;

  @IsEnum(NotificationPriority)
  @IsOptional()
  priority?: NotificationPriority;

  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class SendPushNotificationDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  deviceToken?: string;

  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  sound?: string;

  @IsNumber()
  @IsOptional()
  badge?: number;

  @IsObject()
  @IsOptional()
  data?: Record<string, any>;

  @IsEnum(NotificationPriority)
  @IsOptional()
  priority?: NotificationPriority;

  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
