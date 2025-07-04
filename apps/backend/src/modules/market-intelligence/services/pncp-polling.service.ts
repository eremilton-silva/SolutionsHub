import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { Tender } from '../entities/tender.entity';
import { 
  ConsultarLicitacaoPorDataDto 
} from '../dto/pncp/consultar-licitacao-por-data.dto';
import { 
  PncpResponseLicitacoes, 
  PncpLicitacao 
} from '../dto/pncp/pncp-response.interface';

@Injectable()
export class PNCPPollingService {
  private readonly logger = new Logger(PNCPPollingService.name);
  private readonly baseUrl = 'https://pncp.gov.br/api/consulta';
  private isRunning = false;

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Tender)
    private readonly tenderRepository: Repository<Tender>,
  ) {}

  /**
   * Cron job que roda a cada 30 minutos para sincronizar licitações
   */
  @Cron('0 */30 * * * *', {
    name: 'pncp-polling',
    timeZone: 'America/Sao_Paulo',
  })
  async handlePNCPPolling(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('PNCP polling already running, skipping...');
      return;
    }

    this.isRunning = true;
    this.logger.log('🚀 Iniciando sincronização PNCP...');

    try {
      const { dataInicial, dataFinal } = this.calculateDateRange();
      await this.syncLicitacoes(dataInicial, dataFinal);
      this.logger.log('✅ Sincronização PNCP concluída com sucesso');
    } catch (error) {
      this.logger.error('❌ Erro na sincronização PNCP:', error.message);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Método público para sincronização manual
   */
  async syncLicitacoesManual(
    dataInicial?: string,
    dataFinal?: string,
  ): Promise<{ imported: number; skipped: number; errors: number }> {
    const dateRange = dataInicial && dataFinal 
      ? { dataInicial, dataFinal }
      : this.calculateDateRange();

    return await this.syncLicitacoes(dateRange.dataInicial, dateRange.dataFinal);
  }

  /**
   * Calcula o intervalo de datas para consulta
   */
  private calculateDateRange(): { dataInicial: string; dataFinal: string } {
    const now = new Date();
    const dataFinal = now.toISOString().split('T')[0]; // Hoje

    // Busca a partir de 7 dias atrás para garantir que não perdemos nada
    const dataInicial = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    return { dataInicial, dataFinal };
  }

  /**
   * Realiza a sincronização das licitações do PNCP
   */
  private async syncLicitacoes(
    dataInicial: string,
    dataFinal: string,
  ): Promise<{ imported: number; skipped: number; errors: number }> {
    let pagina = 1;
    let imported = 0;
    let skipped = 0;
    let errors = 0;
    let hasMorePages = true;

    this.logger.log(`📅 Consultando período: ${dataInicial} até ${dataFinal}`);

    while (hasMorePages) {
      try {
        this.logger.log(`📄 Processando página ${pagina}...`);

        const consultaDto: ConsultarLicitacaoPorDataDto = {
          dataInicial,
          dataFinal,
          pagina,
          tamanhoPagina: 100,
        };

        const response = await this.consultarLicitacoesPorData(consultaDto);

        if (response.data.length === 0) {
          this.logger.log('📭 Nenhum registro encontrado nesta página');
          hasMorePages = false;
          break;
        }

        // Processa cada licitação da página
        for (const licitacao of response.data) {
          try {
            const resultado = await this.processarLicitacao(licitacao);
            if (resultado === 'imported') {
              imported++;
            } else if (resultado === 'skipped') {
              skipped++;
            }
          } catch (error) {
            this.logger.warn(
              `⚠️ Erro ao processar licitação ${licitacao.numeroControlePNCP}:`,
              error.message,
            );
            errors++;
          }
        }

        // Verifica se há mais páginas
        hasMorePages = pagina < response.meta.quantidadePaginas;
        pagina++;

        // Pequena pausa entre requisições para não sobrecarregar a API
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        this.logger.error(`❌ Erro ao consultar página ${pagina}:`, error.message);
        errors++;
        
        // Se der erro, tenta a próxima página (pode ser erro temporário)
        pagina++;
        if (pagina > 50) { // Limite de segurança
          this.logger.error('🚨 Muitas páginas com erro, interrompendo...');
          break;
        }
      }
    }

    this.logger.log(
      `📊 Resultado da sincronização: ${imported} importadas, ${skipped} já existiam, ${errors} erros`,
    );

    return { imported, skipped, errors };
  }

  /**
   * Consulta licitações por data na API do PNCP
   */
  private async consultarLicitacoesPorData(
    consultaDto: ConsultarLicitacaoPorDataDto,
  ): Promise<PncpResponseLicitacoes> {
    const url = `${this.baseUrl}/contratacao/por-data-de-publicacao`;
    
    const params = new URLSearchParams({
      dataInicial: consultaDto.dataInicial,
      dataFinal: consultaDto.dataFinal,
      pagina: (consultaDto.pagina || 1).toString(),
      tamanhoPagina: (consultaDto.tamanhoPagina || 100).toString(),
    });

    if (consultaDto.cnpjOrgao) {
      params.append('cnpjOrgao', consultaDto.cnpjOrgao);
    }

    if (consultaDto.modalidade) {
      params.append('modalidade', consultaDto.modalidade);
    }

    const fullUrl = `${url}?${params.toString()}`;
    
    this.logger.debug(`🌐 Consultando: ${fullUrl}`);

    const response = await firstValueFrom(
      this.httpService.get<PncpResponseLicitacoes>(fullUrl, {
        timeout: 30000,
        headers: {
          'User-Agent': 'SolutionHub/1.0.0',
          'Accept': 'application/json',
        },
      }),
    );

    return response.data;
  }

  /**
   * Processa uma licitação individual
   */
  private async processarLicitacao(
    licitacao: PncpLicitacao,
  ): Promise<'imported' | 'skipped'> {
    // Verifica se já existe
    const existingTender = await this.tenderRepository.findOne({
      where: { numeroControlePNCP: licitacao.numeroControlePNCP },
    });

    if (existingTender) {
      // Atualiza a data de sincronização
      existingTender.lastSyncAt = new Date();
      await this.tenderRepository.save(existingTender);
      return 'skipped';
    }

    // Cria nova licitação
    const tenderData: Partial<Tender> = {
      numeroControlePNCP: licitacao.numeroControlePNCP,
      linkSistemaOrigem: licitacao.linkSistemaOrigem,
      objetoCompra: licitacao.objetoCompra,
      numeroCompra: licitacao.numeroCompra,
      numeroProcesso: licitacao.numeroProcesso,
      tipoInstrumentoConvocatorioNome: licitacao.tipoInstrumentoConvocatorioNome,
      
      // Modalidade
      modalidadeCodigo: licitacao.modalidade?.codigo,
      modalidadeNome: licitacao.modalidade?.nome || 'Não informado',
      modoDisputa: licitacao.modoDisputa,
      
      // Valores
      valorTotalEstimado: licitacao.valorTotalEstimado,
      valorTotalHomologado: licitacao.valorTotalHomologado,
      
      // Situação
      situacaoCompraCodigo: licitacao.situacaoCompra?.codigo,
      situacaoCompraNome: licitacao.situacaoCompra?.nome || 'Não informado',
      
      // Datas
      dataPublicacaoPncp: new Date(licitacao.dataPublicacaoPncp),
      dataAberturaProposta: licitacao.dataAberturaProposta 
        ? new Date(licitacao.dataAberturaProposta) 
        : undefined,
      dataEncerramentoProposta: licitacao.dataEncerramentoProposta 
        ? new Date(licitacao.dataEncerramentoProposta) 
        : undefined,
      
      // Organização
      organizationCnpj: licitacao.orgaoEntidade.cnpj,
      organizationRazaoSocial: licitacao.orgaoEntidade.razaoSocial,
      organizationPoderId: licitacao.orgaoEntidade.poderId,
      organizationEsferaId: licitacao.orgaoEntidade.esferaId,
      
      // Unidade
      unidadeCodigoUnidade: licitacao.unidadeOrgao.codigoUnidade,
      unidadeNomeUnidade: licitacao.unidadeOrgao.nomeUnidade,
      unidadeUfNome: licitacao.unidadeOrgao.ufNome,
      unidadeUfSigla: licitacao.unidadeOrgao.ufSigla,
      unidadeMunicipioNome: licitacao.unidadeOrgao.municipioNome,
      unidadeCodigoIbge: licitacao.unidadeOrgao.codigoIbge,
      
      // Flags
      srp: licitacao.srp,
      compraEmergencial: licitacao.compraEmergencial,
      licitacaoAssociada: licitacao.licitacaoAssociada,
      
      // Auditoria
      lastSyncAt: new Date(),
    };

    const newTender = this.tenderRepository.create(tenderData);

    await this.tenderRepository.save(newTender);
    
    this.logger.debug(
      `✨ Nova licitação importada: ${licitacao.numeroControlePNCP} - ${licitacao.objetoCompra.substring(0, 50)}...`,
    );

    return 'imported';
  }

  /**
   * Status do serviço de polling
   */
  getPollingStatus(): {
    isRunning: boolean;
    lastExecution?: Date;
    nextExecution?: Date;
  } {
    return {
      isRunning: this.isRunning,
      // Aqui pode adicionar lógica para tracking de execuções
    };
  }
}
