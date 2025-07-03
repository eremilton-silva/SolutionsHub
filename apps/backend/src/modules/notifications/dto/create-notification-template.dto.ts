import { IsString, IsEnum, IsOptional, IsObject, IsArray, IsBoolean } from 'class-validator';
import { NotificationType, NotificationCategory } from '../entities/notification.entity';

export class CreateNotificationTemplateDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsEnum(NotificationCategory)
  category: NotificationCategory;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  template: string;

  @IsString()
  @IsOptional()
  htmlTemplate?: string;

  @IsArray()
  @IsOptional()
  variables?: Array<{
    name: string;
    description: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'object';
    required: boolean;
    defaultValue?: any;
    example?: any;
  }>;

  @IsObject()
  @IsOptional()
  config?: Record<string, any>;

  @IsObject()
  @IsOptional()
  conditions?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
