import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { TenderType, TenderStatus, TenderModalidade } from '../entities/tender.entity';

export interface PncpTender {
  numeroControlePNCP: string;
  numeroCompra: string;
  numeroProcesso: string;
  anoCompra: number;
  sequencialCompra: number;
  processo: string;
  resumo: string;
  cidadeOrgao: string;
  ufOrgao: string;
  orgaoSubRogado: {
    cnpj: string;
    razaoSocial: string;
    poder: string;
    esfera: string;
  };
  modalidadeId: number;
  modalidadeNome: string;
  unidadeOrgao: {
    cnpj: string;
    razaoSocial: string;
    poder: string;
    esfera: string;
  };
  informacaoComplementar: string;
  linkSistemaOrigem: string;
  dataAberturaProposta: string;
  dataEncerramentoPropostaData: string;
  valorEstimadoTotal: number;
  valorMaximoTotal: number;
  situacaoCompra: string;
  amparoLegal: {
    descricao: string;
    fundamento: string;
  };
  srp: boolean;
  dataPublicacaoPncp: string;
  dataInclusao: string;
  dataAtualizacao: string;
}

export interface PncpSearchParams {
  dataInicial?: string;
  dataFinal?: string;
  cnpjOrgao?: string;
  codigoModalidade?: number;
  ufOrgao?: string;
  municipioOrgao?: string;
  valorMinimo?: number;
  valorMaximo?: number;
  situacao?: string;
  termo?: string;
  pagina?: number;
  tamanhoPagina?: number;
}

@Injectable()
export class PncpService {
  private readonly logger = new Logger(PncpService.name);
  private readonly baseUrl = 'https://pncp.gov.br/api/consulta/v1';

  constructor(private readonly httpService: HttpService) {}

  async searchTenders(params: PncpSearchParams): Promise<{
    data: PncpTender[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const url = `${this.baseUrl}/contratacoes/publicacoes`;
      
      const searchParams = new URLSearchParams();
      
      if (params.dataInicial) searchParams.append('dataInicial', params.dataInicial);
      if (params.dataFinal) searchParams.append('dataFinal', params.dataFinal);
      if (params.cnpjOrgao) searchParams.append('cnpjOrgao', params.cnpjOrgao);
      if (params.codigoModalidade) searchParams.append('codigoModalidade', params.codigoModalidade.toString());
      if (params.ufOrgao) searchParams.append('ufOrgao', params.ufOrgao);
      if (params.municipioOrgao) searchParams.append('municipioOrgao', params.municipioOrgao);
      if (params.valorMinimo) searchParams.append('valorMinimo', params.valorMinimo.toString());
      if (params.valorMaximo) searchParams.append('valorMaximo', params.valorMaximo.toString());
      if (params.situacao) searchParams.append('situacao', params.situacao);
      if (params.termo) searchParams.append('termo', params.termo);
      
      const page = params.pagina || 1;
      const pageSize = params.tamanhoPagina || 20;
      searchParams.append('pagina', page.toString());
      searchParams.append('tamanhoPagina', pageSize.toString());

      const response = await firstValueFrom(
        this.httpService.get(`${url}?${searchParams.toString()}`, {
          timeout: 30000,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'SolutionHub/1.0',
          },
        })
      );

      const tenders = response.data?.data || [];
      const total = response.data?.total || 0;

      return {
        data: tenders,
        total,
        page,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      this.logger.error('Error searching PNCP tenders:', error.message);
      
      if (error.response?.status === 429) {
        throw new HttpException(
          'Rate limit exceeded. Please try again later.',
          HttpStatus.TOO_MANY_REQUESTS
        );
      }
      
      throw new HttpException(
        'Error connecting to PNCP API',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }

  async getTenderDetails(numeroControlePNCP: string): Promise<PncpTender> {
    try {
      const url = `${this.baseUrl}/contratacoes/publicacoes/${numeroControlePNCP}`;
      
      const response = await firstValueFrom(
        this.httpService.get(url, {
          timeout: 15000,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'SolutionHub/1.0',
          },
        })
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching tender details for ${numeroControlePNCP}:`, error.message);
      throw new HttpException(
        'Error fetching tender details from PNCP',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }

  async getTenderItems(numeroControlePNCP: string): Promise<any[]> {
    try {
      const url = `${this.baseUrl}/contratacoes/publicacoes/${numeroControlePNCP}/itens`;
      
      const response = await firstValueFrom(
        this.httpService.get(url, {
          timeout: 15000,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'SolutionHub/1.0',
          },
        })
      );

      return response.data?.data || [];
    } catch (error) {
      this.logger.warn(`Error fetching tender items for ${numeroControlePNCP}:`, error.message);
      return [];
    }
  }

  async getTenderDocuments(numeroControlePNCP: string): Promise<any[]> {
    try {
      const url = `${this.baseUrl}/contratacoes/publicacoes/${numeroControlePNCP}/arquivos`;
      
      const response = await firstValueFrom(
        this.httpService.get(url, {
          timeout: 15000,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'SolutionHub/1.0',
          },
        })
      );

      return response.data?.data || [];
    } catch (error) {
      this.logger.warn(`Error fetching tender documents for ${numeroControlePNCP}:`, error.message);
      return [];
    }
  }

  async getModalidades(): Promise<Array<{ id: number; nome: string }>> {
    try {
      const url = `${this.baseUrl}/tipos/modalidades`;
      
      const response = await firstValueFrom(
        this.httpService.get(url, {
          timeout: 10000,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'SolutionHub/1.0',
          },
        })
      );

      return response.data?.data || [];
    } catch (error) {
      this.logger.error('Error fetching modalidades from PNCP:', error.message);
      return [];
    }
  }

  async getUfs(): Promise<Array<{ sigla: string; nome: string }>> {
    try {
      const url = `${this.baseUrl}/tipos/unidades-federativas`;
      
      const response = await firstValueFrom(
        this.httpService.get(url, {
          timeout: 10000,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'SolutionHub/1.0',
          },
        })
      );

      return response.data?.data || [];
    } catch (error) {
      this.logger.error('Error fetching UFs from PNCP:', error.message);
      return [];
    }
  }

  // Mapear dados do PNCP para nossa entidade
  mapPncpToTender(pncpTender: PncpTender): Partial<any> {
    return {
      pncpId: pncpTender.numeroControlePNCP,
      protocolNumber: pncpTender.numeroCompra,
      processNumber: pncpTender.numeroProcesso || pncpTender.processo,
      title: pncpTender.resumo,
      organizationName: pncpTender.unidadeOrgao?.razaoSocial || pncpTender.orgaoSubRogado?.razaoSocial,
      organizationCnpj: pncpTender.unidadeOrgao?.cnpj || pncpTender.orgaoSubRogado?.cnpj,
      organizationMunicipality: pncpTender.cidadeOrgao,
      organizationState: pncpTender.ufOrgao,
      type: this.mapModalidadeToType(pncpTender.modalidadeNome),
      modalidade: TenderModalidade.ELETRONICO, // Assumir eletrônico por padrão
      status: this.mapSituacaoToStatus(pncpTender.situacaoCompra),
      estimatedValue: pncpTender.valorEstimadoTotal,
      maximumValue: pncpTender.valorMaximoTotal,
      publishDate: new Date(pncpTender.dataPublicacaoPncp),
      proposalDeadline: pncpTender.dataEncerramentoPropostaData ? 
        new Date(pncpTender.dataEncerramentoPropostaData) : null,
      openingDate: pncpTender.dataAberturaProposta ? 
        new Date(pncpTender.dataAberturaProposta) : null,
      observations: pncpTender.informacaoComplementar,
      lastSyncAt: new Date(),
      metadata: {
        linkSistemaOrigem: pncpTender.linkSistemaOrigem,
        amparoLegal: pncpTender.amparoLegal,
        srp: pncpTender.srp,
        dataInclusao: pncpTender.dataInclusao,
        dataAtualizacao: pncpTender.dataAtualizacao,
      },
    };
  }

  private mapModalidadeToType(modalidadeNome: string): TenderType {
    const modalidade = modalidadeNome?.toLowerCase();
    
    if (modalidade?.includes('pregão eletrônico')) return TenderType.PREGAO_ELETRONICO;
    if (modalidade?.includes('pregão presencial')) return TenderType.PREGAO_PRESENCIAL;
    if (modalidade?.includes('concorrência')) return TenderType.CONCORRENCIA;
    if (modalidade?.includes('tomada')) return TenderType.TOMADA_PRECOS;
    if (modalidade?.includes('convite')) return TenderType.CONVITE;
    if (modalidade?.includes('concurso')) return TenderType.CONCURSO;
    if (modalidade?.includes('leilão')) return TenderType.LEILAO;
    if (modalidade?.includes('rdc')) return TenderType.RDC;
    if (modalidade?.includes('diálogo')) return TenderType.DIALOGO_COMPETITIVO;
    
    return TenderType.PREGAO_ELETRONICO; // Default
  }

  private mapSituacaoToStatus(situacao: string): TenderStatus {
    const situacaoLower = situacao?.toLowerCase();
    
    if (situacaoLower?.includes('publicada')) return TenderStatus.PUBLISHED;
    if (situacaoLower?.includes('aberta')) return TenderStatus.OPEN;
    if (situacaoLower?.includes('cancelada')) return TenderStatus.CANCELLED;
    if (situacaoLower?.includes('suspensa')) return TenderStatus.SUSPENDED;
    if (situacaoLower?.includes('revogada')) return TenderStatus.REVOKED;
    if (situacaoLower?.includes('homologada')) return TenderStatus.HOMOLOGATION;
    if (situacaoLower?.includes('adjudicada')) return TenderStatus.ADJUDICATION;
    if (situacaoLower?.includes('fracassada')) return TenderStatus.FAILED;
    
    return TenderStatus.PUBLISHED; // Default
  }
}
