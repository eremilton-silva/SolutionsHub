import { IsArray, IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { NotificationType, NotificationPriority, NotificationCategory } from '../entities/notification.entity';

export class CreateBulkNotificationDto {
  @IsArray()
  @IsString({ each: true })
  userIds: string[];

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType;

  @IsEnum(NotificationPriority)
  @IsOptional()
  priority?: NotificationPriority;

  @IsEnum(NotificationCategory)
  category: NotificationCategory;

  @IsOptional()
  data?: any;

  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @IsOptional()
  metadata?: any;
}
