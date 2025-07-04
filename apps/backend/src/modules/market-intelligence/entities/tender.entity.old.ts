import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

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

@Entity('tenders')
@Index(['numeroControlePNCP'], { unique: true })
@Index(['situacaoCompra', 'dataPublicacaoPncp'])
@Index(['organizationCnpj'])
@Index(['valorTotalEstimado'])
@Index(['modalidadeNome'])
export class Tender {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Campos principais do PNCP
  @Column({ unique: true })
  numeroControlePNCP: string;

  @Column()
  linkSistemaOrigem: string;

  @Column('text')
  objetoCompra: string;

  @Column({ nullable: true })
  numeroCompra: string;

  @Column({ nullable: true })
  numeroProcesso: string;

  @Column({ nullable: true })
  tipoInstrumentoConvocatorioNome: string;

  // Modalidade
  @Column({ nullable: true })
  modalidadeCodigo: number;

  @Column()
  modalidadeNome: string;

  @Column({ nullable: true })
  modoDisputa: string;

  // Valores
  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  valorTotalEstimado: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  valorTotalHomologado: number;

  // Situação
  @Column({ nullable: true })
  situacaoCompraCodigo: number;

  @Column()
  situacaoCompraNome: string;

  // Datas importantes
  @Column({ type: 'datetime' })
  dataPublicacaoPncp: Date;

  @Column({ type: 'datetime', nullable: true })
  dataAberturaProposta: Date;

  @Column({ type: 'datetime', nullable: true })
  dataEncerramentoProposta: Date;

  // Órgão e entidade
  @Column()
  organizationCnpj: string;

  @Column()
  organizationRazaoSocial: string;

  @Column({ nullable: true })
  organizationPoderId: string;

  @Column({ nullable: true })
  organizationEsferaId: string;

  // Unidade do órgão
  @Column({ nullable: true })
  unidadeCodigoUnidade: string;

  @Column({ nullable: true })
  unidadeNomeUnidade: string;

  @Column({ nullable: true })
  unidadeUfNome: string;

  @Column({ nullable: true })
  unidadeUfSigla: string;

  @Column({ nullable: true })
  unidadeMunicipioNome: string;

  @Column({ nullable: true })
  unidadeCodigoIbge: string;

  // Flags especiais
  @Column({ default: false })
  srp: boolean; // Sistema de Registro de Preços

  @Column({ default: false })
  compraEmergencial: boolean;

  @Column({ nullable: true })
  licitacaoAssociada: string;
  estimatedValue: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  maximumValue: number;

  @Column({ type: 'datetime', nullable: true })
  publishDate: Date;

  @Column({ type: 'datetime', nullable: true })
  proposalDeadline: Date;

  @Column({ type: 'datetime', nullable: true })
  openingDate: Date;

  @Column('text', { nullable: true })
  observations: string;

  @Column('simple-json', { nullable: true })
  documents: Array<{
    name: string;
    url: string;
    type: string;
    size?: number;
  }>;

  @Column('simple-json', { nullable: true })
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unit: string;
    estimatedValue?: number;
  }>;

  @Column('simple-json', { nullable: true })
  contacts: Array<{
    name: string;
    email?: string;
    phone?: string;
    role?: string;
  }>;

  @Column('text', { nullable: true })
  eligibilityCriteria: string;

  @Column('text', { nullable: true })
  evaluationCriteria: string;

  @Column({ type: 'datetime', nullable: true })
  participationDeadline: Date;

  @Column({ default: false })
  isMonitored: boolean;

  @Column({ default: false })
  isOpportunity: boolean;

  @Column('simple-json', { nullable: true })
  keywords: string[];

  @Column('simple-json', { nullable: true })
  categories: string[];

  @Column({ type: 'float', default: 0 })
  relevanceScore: number;

  @Column({ nullable: true })
  assignedUserId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignedUserId' })
  assignedUser: User;

  @Column('simple-json', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  lastSyncAt: Date;
}
