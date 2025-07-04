export interface PncpOrgaoEntidade {
  cnpj: string;
  razaoSocial: string;
  poderId: string;
  esferaId: string;
}

export interface PncpUnidadeOrgao {
  codigoUnidade: string;
  nomeUnidade: string;
  ufNome: string;
  ufSigla: string;
  municipioNome: string;
  codigoIbge: string;
}

export interface PncpModalidade {
  codigo: number;
  nome: string;
}

export interface PncpSituacaoCompra {
  codigo: number;
  nome: string;
}

export interface PncpLicitacao {
  numeroControlePNCP: string;
  linkSistemaOrigem: string;
  objetoCompra: string;
  numeroCompra: string;
  numeroProcesso?: string;
  tipoInstrumentoConvocatorioNome: string;
  modalidade: PncpModalidade;
  modoDisputa: string;
  valorTotalEstimado: number;
  valorTotalHomologado?: number;
  situacaoCompra: PncpSituacaoCompra;
  dataPublicacaoPncp: string; // ISO date string
  dataAberturaProposta?: string; // ISO date string
  dataEncerramentoProposta?: string; // ISO date string
  orgaoEntidade: PncpOrgaoEntidade;
  unidadeOrgao: PncpUnidadeOrgao;
  srp: boolean; // Sistema de Registro de Preços
  licitacaoAssociada?: string;
  compraEmergencial: boolean;
}

export interface PncpPaginacao {
  totalDeRegistros: number;
  quantidadePaginas: number;
  paginaAtual: number;
  proximaPagina?: number;
  paginaAnterior?: number;
  tamanhoPagina: number;
}

export interface PncpResponseLicitacoes {
  data: PncpLicitacao[];
  links: {
    first: string;
    last: string;
    prev?: string;
    next?: string;
  };
  meta: PncpPaginacao;
}
