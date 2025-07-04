import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

export interface PncpSearchParams {
  dataInicial?: string;
  dataFinal?: string;
  cnpjOrgao?: string;
  modalidade?: string;
  palavraChave?: string;
  situacao?: string;
  pagina?: number;
  tamanhoPagina?: number;
}

@Injectable()
export class PncpService {
  private readonly logger = new Logger(PncpService.name);
  private readonly baseUrl = 'https://pncp.gov.br/api/pncp/v1';

  constructor(private readonly httpService: HttpService) {}

  /**
   * Busca licitações no PNCP com base nos parâmetros fornecidos
   */
  async searchTenders(params: PncpSearchParams = {}): Promise<{ tenders: any[]; total: number }> {
    try {
      this.logger.log('Simulando busca de licitações no PNCP');
      
      // Por enquanto, retornamos dados mockados para evitar problemas de API
      const mockTenders = [
        {
          numeroControlePNCP: '00000000000000000001',
          numeroCompra: '001/2025',
          objetoCompra: 'Contratação de serviços de consultoria em tecnologia',
          orgaoEntidade: {
            cnpj: '00000000000001',
            razaoSocial: 'Prefeitura Municipal de São Paulo',
            poderId: 'EXECUTIVO',
            esferaId: 'MUNICIPAL',
          },
          modalidadeId: 7,
          modalidadeNome: 'Pregão Eletrônico',
          valorEstimado: 150000.00,
          dataAberturaPropostas: '2025-07-15T09:00:00Z',
          dataEncerramentoPropostas: '2025-07-20T18:00:00Z',
          situacaoCompra: 'Publicada',
          linkSistemaOrigem: 'https://exemplo.com/licitacao/001',
          orcamentosRecebidos: 0,
        },
        {
          numeroControlePNCP: '00000000000000000002',
          numeroCompra: '002/2025',
          objetoCompra: 'Aquisição de equipamentos de informática',
          orgaoEntidade: {
            cnpj: '00000000000002',
            razaoSocial: 'Governo do Estado de São Paulo',
            poderId: 'EXECUTIVO',
            esferaId: 'ESTADUAL',
          },
          modalidadeId: 7,
          modalidadeNome: 'Pregão Eletrônico',
          valorEstimado: 250000.00,
          dataAberturaPropostas: '2025-07-10T09:00:00Z',
          dataEncerramentoPropostas: '2025-07-25T18:00:00Z',
          situacaoCompra: 'Aberta',
          linkSistemaOrigem: 'https://exemplo.com/licitacao/002',
          orcamentosRecebidos: 3,
        }
      ];

      return {
        tenders: mockTenders,
        total: mockTenders.length,
      };
    } catch (error) {
      this.logger.error('Erro na busca de licitações:', error);
      throw new HttpException(
        'Erro ao consultar licitações no PNCP',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  /**
   * Busca detalhes de uma licitação específica
   */
  async getTenderDetails(numeroControlePNCP: string): Promise<any> {
    try {
      this.logger.log(`Simulando busca de detalhes da licitação ${numeroControlePNCP}`);
      
      return {
        numeroControlePNCP,
        numeroCompra: '001/2025',
        objetoCompra: 'Contratação de serviços de consultoria em tecnologia',
        orgaoEntidade: {
          cnpj: '00000000000001',
          razaoSocial: 'Prefeitura Municipal de São Paulo',
          poderId: 'EXECUTIVO',
          esferaId: 'MUNICIPAL',
        },
        modalidadeId: 7,
        modalidadeNome: 'Pregão Eletrônico',
        valorEstimado: 150000.00,
        dataAberturaPropostas: '2025-07-15T09:00:00Z',
        dataEncerramentoPropostas: '2025-07-20T18:00:00Z',
        situacaoCompra: 'Publicada',
        linkSistemaOrigem: 'https://exemplo.com/licitacao/001',
        orcamentosRecebidos: 0,
        itensCompra: [
          {
            numeroItem: 1,
            descricaoItem: 'Serviços de consultoria especializada em desenvolvimento de software',
            unidadeMedida: 'HORA',
            quantidade: 200,
            valorUnitarioEstimado: 75.00,
            valorTotal: 15000.00,
          }
        ],
      };
    } catch (error) {
      this.logger.error(`Erro ao buscar detalhes da licitação ${numeroControlePNCP}:`, error);
      throw new HttpException(
        'Erro ao consultar detalhes da licitação',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  /**
   * Busca órgãos/entidades
   */
  async getOrgaos(searchTerm?: string): Promise<any[]> {
    this.logger.log('Simulando busca de órgãos');
    
    return [
      {
        cnpj: '00000000000001',
        razaoSocial: 'Prefeitura Municipal de São Paulo',
        poderId: 'EXECUTIVO',
        esferaId: 'MUNICIPAL',
      },
      {
        cnpj: '00000000000002',
        razaoSocial: 'Governo do Estado de São Paulo',
        poderId: 'EXECUTIVO',
        esferaId: 'ESTADUAL',
      }
    ];
  }

  /**
   * Busca modalidades de licitação
   */
  async getModalidades(): Promise<any[]> {
    this.logger.log('Simulando busca de modalidades');
    
    return [
      { id: 1, nome: 'Concorrência' },
      { id: 2, nome: 'Tomada de Preços' },
      { id: 3, nome: 'Convite' },
      { id: 7, nome: 'Pregão Eletrônico' },
      { id: 8, nome: 'Dispensa' },
      { id: 9, nome: 'Inexigibilidade' },
    ];
  }

  /**
   * Busca UFs (Estados) brasileiros
   */
  async getUfs(): Promise<string[]> {
    this.logger.log('Retornando lista de UFs');
    
    return [
      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
      'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
      'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];
  }

  /**
   * Busca itens de uma licitação específica
   */
  async getTenderItems(numeroControlePNCP: string): Promise<any[]> {
    this.logger.log(`Simulando busca de itens para licitação ${numeroControlePNCP}`);
    
    return [
      {
        numeroItem: 1,
        descricaoItem: 'Serviços de consultoria especializada em desenvolvimento de software',
        unidadeMedida: 'HORA',
        quantidade: 200,
        valorUnitarioEstimado: 75.00,
        valorTotal: 15000.00,
      },
      {
        numeroItem: 2,
        descricaoItem: 'Licenças de software para desenvolvimento',
        unidadeMedida: 'UNIDADE',
        quantidade: 10,
        valorUnitarioEstimado: 500.00,
        valorTotal: 5000.00,
      }
    ];
  }

  /**
   * Busca documentos de uma licitação específica
   */
  async getTenderDocuments(numeroControlePNCP: string): Promise<any[]> {
    this.logger.log(`Simulando busca de documentos para licitação ${numeroControlePNCP}`);
    
    return [
      {
        nome: 'Edital.pdf',
        tipo: 'EDITAL',
        url: 'https://exemplo.com/documentos/edital.pdf',
        tamanho: 1024567,
        dataPublicacao: '2025-07-01T10:00:00Z'
      },
      {
        nome: 'Anexo_I_Termo_Referencia.pdf',
        tipo: 'ANEXO',
        url: 'https://exemplo.com/documentos/anexo1.pdf',
        tamanho: 512344,
        dataPublicacao: '2025-07-01T10:00:00Z'
      }
    ];
  }

  /**
   * Mapeia dados do PNCP para o formato interno do Tender
   */
  mapPncpToTender(pncpData: any): any {
    return {
      pncpId: pncpData.numeroControlePNCP,
      protocolNumber: pncpData.numeroCompra,
      processNumber: pncpData.numeroCompra,
      title: pncpData.objetoCompra,
      description: pncpData.objetoCompra,
      organizationName: pncpData.orgaoEntidade.razaoSocial,
      organizationCnpj: pncpData.orgaoEntidade.cnpj,
      organizationMunicipality: pncpData.orgaoEntidade.municipio || '',
      organizationState: pncpData.orgaoEntidade.uf || '',
      type: this.mapModalidadeToType(pncpData.modalidadeId),
      modalidade: 'eletronico',
      status: this.mapSituacaoToStatus(pncpData.situacaoCompra),
      estimatedValue: pncpData.valorEstimado,
      publishDate: new Date(pncpData.dataPublicacao || new Date()),
      proposalDeadline: new Date(pncpData.dataEncerramentoPropostas),
      openingDate: new Date(pncpData.dataAberturaPropostas),
      observations: '',
    };
  }

  private mapModalidadeToType(modalidadeId: number): string {
    const modalidadeMap: Record<number, string> = {
      1: 'concorrencia',
      2: 'tomada_precos',
      3: 'convite',
      4: 'concurso',
      5: 'leilao',
      6: 'pregao_presencial',
      7: 'pregao_eletronico',
      8: 'rdc',
      9: 'dialogo_competitivo',
    };

    return modalidadeMap[modalidadeId] || 'pregao_eletronico';
  }

  private mapSituacaoToStatus(situacao: string): string {
    const situacaoLower = situacao.toLowerCase();
    
    if (situacaoLower.includes('publicada')) return 'published';
    if (situacaoLower.includes('aberta')) return 'open';
    if (situacaoLower.includes('homologada')) return 'homologation';
    if (situacaoLower.includes('adjudicada')) return 'adjudication';
    if (situacaoLower.includes('cancelada')) return 'cancelled';
    if (situacaoLower.includes('suspensa')) return 'suspended';
    if (situacaoLower.includes('revogada')) return 'revoked';
    
    return 'published';
  }
}
