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

@Entity('tenders')
@Index(['numeroControlePNCP'], { unique: true })
@Index(['situacaoCompraNome', 'dataPublicacaoPncp'])
@Index(['organizationCnpj'])
@Index(['valorTotalEstimado'])
@Index(['modalidadeNome'])
@Index(['unidadeUfSigla'])
export class Tender {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // === CAMPOS PRINCIPAIS DO PNCP ===
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

  // === MODALIDADE ===
  @Column({ nullable: true })
  modalidadeCodigo: number;

  @Column()
  modalidadeNome: string;

  @Column({ nullable: true })
  modoDisputa: string;

  // === VALORES ===
  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  valorTotalEstimado: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  valorTotalHomologado: number;

  // === SITUAÇÃO ===
  @Column({ nullable: true })
  situacaoCompraCodigo: number;

  @Column()
  situacaoCompraNome: string;

  // === DATAS IMPORTANTES ===
  @Column({ type: 'datetime' })
  dataPublicacaoPncp: Date;

  @Column({ type: 'datetime', nullable: true })
  dataAberturaProposta: Date;

  @Column({ type: 'datetime', nullable: true })
  dataEncerramentoProposta: Date;

  // === ÓRGÃO E ENTIDADE ===
  @Column()
  organizationCnpj: string;

  @Column()
  organizationRazaoSocial: string;

  @Column({ nullable: true })
  organizationPoderId: string;

  @Column({ nullable: true })
  organizationEsferaId: string;

  // === UNIDADE DO ÓRGÃO ===
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

  // === FLAGS ESPECIAIS ===
  @Column({ default: false })
  srp: boolean; // Sistema de Registro de Preços

  @Column({ default: false })
  compraEmergencial: boolean;

  @Column({ nullable: true })
  licitacaoAssociada: string;

  // === CAMPOS INTERNOS DE GESTÃO ===
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

  // === CAMPOS DE AUDITORIA ===
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  lastSyncAt: Date;

  // === CAMPOS LEGADOS (manter compatibilidade) ===
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

  @Column('text', { nullable: true })
  observations: string;
}
