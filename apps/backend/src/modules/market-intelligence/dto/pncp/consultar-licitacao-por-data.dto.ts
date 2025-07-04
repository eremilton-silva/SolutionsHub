import { IsString, IsOptional, IsInt, Min, Max, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class ConsultarLicitacaoPorDataDto {
  @IsDateString()
  dataInicial: string; // formato: yyyy-MM-dd

  @IsDateString()
  dataFinal: string; // formato: yyyy-MM-dd

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  pagina?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(10)
  @Max(500)
  @Type(() => Number)
  tamanhoPagina?: number = 100;

  @IsOptional()
  @IsString()
  cnpjOrgao?: string;

  @IsOptional()
  @IsString()
  modalidade?: string;
}
