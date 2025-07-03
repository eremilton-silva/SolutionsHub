import { IsString, IsOptional, IsEnum, IsNumber, IsDateString, IsArray, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { OpportunityStatus, OpportunityPriority, OpportunitySource } from '../entities/opportunity.entity';

export class CreateOpportunityDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(OpportunityStatus)
  status?: OpportunityStatus;

  @IsOptional()
  @IsEnum(OpportunityPriority)
  priority?: OpportunityPriority;

  @IsOptional()
  @IsEnum(OpportunitySource)
  source?: OpportunitySource;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  estimatedValue?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  proposalValue?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  probabilityPercent?: number;

  @IsOptional()
  @IsDateString()
  expectedCloseDate?: string;

  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsString()
  assignedUserId?: string;

  @IsOptional()
  @IsString()
  tenderId?: string;

  @IsOptional()
  @IsArray()
  competitors?: Array<{
    name: string;
    estimatedValue?: number;
    strengths?: string[];
    weaknesses?: string[];
  }>;

  @IsOptional()
  @IsArray()
  requirements?: Array<{
    description: string;
    isMandatory: boolean;
    isCompliant: boolean;
    notes?: string;
  }>;

  @IsOptional()
  @IsArray()
  contacts?: Array<{
    name: string;
    role: string;
    email?: string;
    phone?: string;
    isPrimary: boolean;
  }>;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsDateString()
  nextFollowUpDate?: string;

  @IsOptional()
  @IsString()
  nextFollowUpNotes?: string;
}
