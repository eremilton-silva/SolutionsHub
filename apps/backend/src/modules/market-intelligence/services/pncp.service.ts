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
}
