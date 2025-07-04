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
@Index(['status', 'publishDate'])
@Index(['organizationName'])
@Index(['estimatedValue'])
export class Tender {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  pncpId: string;

  @Column()
  protocolNumber: string;

  @Column()
  processNumber: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column()
  organizationName: string;

  @Column()
  organizationCnpj: string;

  @Column({ nullable: true })
  organizationMunicipality: string;

  @Column({ nullable: true })
  organizationState: string;

  @Column({
    type: 'varchar',
    // enum: TenderType, // Comentado para SQLite
  })
  type: TenderType;

  @Column({
    type: 'varchar',
    // enum: TenderModalidade, // Comentado para SQLite
  })
  modalidade: TenderModalidade;

  @Column({
    type: 'varchar',
    // enum: TenderStatus, // Comentado para SQLite
    default: TenderStatus.DRAFT,
  })
  status: TenderStatus;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
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
