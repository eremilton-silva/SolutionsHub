import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTemplateNotificationDto {
  @IsString()
  @IsNotEmpty()
  templateId: string;

  @IsOptional()
  variables?: Record<string, any>;

  @IsString()
  @IsNotEmpty()
  recipientId: string;

  @IsString()
  @IsNotEmpty()
  recipientType: string;
}
