import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional, IsDateString, IsString } from 'class-validator';
import { CreateNotificationDto } from './create-notification.dto';
import { NotificationStatus } from '../entities/notification.entity';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @IsEnum(NotificationStatus)
  @IsOptional()
  status?: NotificationStatus;

  @IsDateString()
  @IsOptional()
  sentAt?: string;

  @IsDateString()
  @IsOptional()
  deliveredAt?: string;

  @IsDateString()
  @IsOptional()
  readAt?: string;

  @IsDateString()
  @IsOptional()
  failedAt?: string;

  @IsString()
  @IsOptional()
  errorMessage?: string;

  @IsOptional()
  errorDetails?: any;
}
