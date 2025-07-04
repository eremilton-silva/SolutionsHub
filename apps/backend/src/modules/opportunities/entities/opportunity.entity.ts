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
import { Client } from '../../crm/entities/client.entity';

export enum OpportunityStatus {
  LEAD = 'lead',
  QUALIFIED = 'qualified',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  WON = 'won',
  LOST = 'lost',
  CANCELLED = 'cancelled',
}

export enum OpportunityPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum OpportunitySource {
  WEBSITE = 'website',
  REFERRAL = 'referral',
  SOCIAL_MEDIA = 'social_media',
  EMAIL_CAMPAIGN = 'email_campaign',
  COLD_CALL = 'cold_call',
  TENDER_MONITORING = 'tender_monitoring',
  PNCP = 'pncp',
  NETWORKING = 'networking',
  OTHER = 'other',
}

@Entity('opportunities')
@Index(['status', 'priority'])
@Index(['clientId', 'status'])
@Index(['assignedUserId'])
@Index(['expectedCloseDate'])
export class Opportunity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({
    type: 'varchar',
    default: OpportunityStatus.LEAD,
  })
  status: OpportunityStatus;

  @Column({
    type: 'varchar',
    default: OpportunityPriority.MEDIUM,
  })
  priority: OpportunityPriority;

  @Column({
    type: 'varchar',
    default: OpportunitySource.OTHER,
  })
  source: OpportunitySource;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  estimatedValue: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  proposalValue: number;

  @Column({ type: 'int', default: 0 })
  probabilityPercent: number;

  @Column({ type: 'date', nullable: true })
  expectedCloseDate: Date;

  @Column({ type: 'date', nullable: true })
  actualCloseDate: Date;

  @Column({ nullable: true })
  clientId: string;

  @ManyToOne(() => Client, { nullable: true })
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column({ nullable: true })
  assignedUserId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignedUserId' })
  assignedUser: User;

  @Column({ nullable: true })
  tenderId: string; // Referência ao tender que originou a oportunidade

  @Column('simple-json', { nullable: true })
  competitors: Array<{
    name: string;
    estimatedValue?: number;
    strengths?: string[];
    weaknesses?: string[];
  }>;

  @Column('simple-json', { nullable: true })
  timeline: Array<{
    date: Date;
    event: string;
    description?: string;
    userId?: string;
  }>;

  @Column('simple-json', { nullable: true })
  requirements: Array<{
    description: string;
    isMandatory: boolean;
    isCompliant: boolean;
    notes?: string;
  }>;

  @Column('simple-json', { nullable: true })
  documents: Array<{
    name: string;
    url: string;
    type: string;
    uploadDate: Date;
    userId: string;
  }>;

  @Column('simple-json', { nullable: true })
  contacts: Array<{
    name: string;
    role: string;
    email?: string;
    phone?: string;
    isPrimary: boolean;
  }>;

  @Column('text', { nullable: true })
  lossReason: string;

  @Column('text', { nullable: true })
  notes: string;

  @Column('simple-json', { nullable: true })
  tags: string[];

  @Column({ type: 'datetime', nullable: true })
  lastContactDate: Date;

  @Column({ type: 'datetime', nullable: true })
  nextFollowUpDate: Date;

  @Column('text', { nullable: true })
  nextFollowUpNotes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Campos calculados
  @Column({ type: 'int', default: 0 })
  daysInStage: number;

  @Column({ type: 'int', default: 0 })
  daysToClose: number;

  @Column({ default: false })
  isOverdue: boolean;
}
