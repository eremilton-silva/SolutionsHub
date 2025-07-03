import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum ClientType {
  INDIVIDUAL = 'individual',
  COMPANY = 'company',
  GOVERNMENT = 'government',
}

export enum ClientStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PROSPECT = 'prospect',
  BLOCKED = 'blocked',
}

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  document: string; // CPF or CNPJ

  @Column({
    type: 'enum',
    enum: ClientType,
    default: ClientType.COMPANY,
  })
  type: ClientType;

  @Column({
    type: 'enum',
    enum: ClientStatus,
    default: ClientStatus.PROSPECT,
  })
  status: ClientStatus;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  sector: string;

  @Column({ nullable: true })
  companySize: string;

  @Column({ nullable: true })
  annualRevenue: number;

  @Column('text', { nullable: true })
  notes: string;

  @Column('jsonb', { nullable: true })
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @Column('jsonb', { nullable: true })
  contacts: {
    name: string;
    email: string;
    phone: string;
    position: string;
    isPrimary: boolean;
  }[];

  @Column('jsonb', { nullable: true })
  customFields: Record<string, any>;

  @Column('uuid', { nullable: true })
  assignedUserId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assignedUserId' })
  assignedUser: User;

  @Column({ nullable: true })
  lastContactDate: Date;

  @Column({ nullable: true })
  nextFollowUpDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get isActive(): boolean {
    return this.status === ClientStatus.ACTIVE;
  }

  get primaryContact() {
    return this.contacts?.find(contact => contact.isPrimary) || this.contacts?.[0];
  }
}
