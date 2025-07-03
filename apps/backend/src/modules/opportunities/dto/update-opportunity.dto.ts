import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsDateString, IsString } from 'class-validator';
import { CreateOpportunityDto } from './create-opportunity.dto';

export class UpdateOpportunityDto extends PartialType(CreateOpportunityDto) {
  @IsOptional()
  @IsDateString()
  actualCloseDate?: string;

  @IsOptional()
  @IsString()
  lossReason?: string;

  @IsOptional()
  @IsDateString()
  lastContactDate?: string;
}
