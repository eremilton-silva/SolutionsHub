// Enums legados mantidos para compatibilidade
export enum TenderStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  OPEN = 'open',
  CLARIFICATION = 'clarification',
  PROPOSAL_OPENING = 'proposal_opening',
  EVALUATION = 'evaluation',
  HOMOLOGATION = 'homologation',
  ADJUDICATION = 'adjudication',
  CANCELLED = 'cancelled',
  SUSPENDED = 'suspended',
  REVOKED = 'revoked',
  FAILED = 'failed',
}

export enum TenderType {
  CONCORRENCIA = 'concorrencia',
  TOMADA_PRECOS = 'tomada_precos',
  CONVITE = 'convite',
  CONCURSO = 'concurso',
  LEILAO = 'leilao',
  PREGAO_PRESENCIAL = 'pregao_presencial',
  PREGAO_ELETRONICO = 'pregao_eletronico',
  RDC = 'rdc',
  DIALOGO_COMPETITIVO = 'dialogo_competitivo',
}

export enum TenderModalidade {
  PRESENCIAL = 'presencial',
  ELETRONICO = 'eletronico',
  HIBRIDO = 'hibrido',
}
