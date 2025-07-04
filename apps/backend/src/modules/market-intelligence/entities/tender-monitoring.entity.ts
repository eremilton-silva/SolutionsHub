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

export enum MonitoringStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  STOPPED = 'stopped',
}

export enum NotificationChannel {
  EMAIL = 'email',
  WHATSAPP = 'whatsapp',
  PUSH = 'push',
  SMS = 'sms',
}

@Entity('tender_monitoring')
@Index(['userId', 'status'])
@Index(['keywords'])
export class TenderMonitoring {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('simple-json')
  keywords: string[];

  @Column('simple-json', { nullable: true })
  organizationFilters: {
    cnpjs?: string[];
    municipalities?: string[];
    states?: string[];
    excludeCnpjs?: string[];
  };

  @Column('simple-json', { nullable: true })
  valueFilters: {
    minValue?: number;
    maxValue?: number;
  };

  @Column('simple-json', { nullable: true })
  typeFilters: string[];

  @Column('simple-json', { nullable: true })
  categoryFilters: string[];

  @Column({
    type: 'varchar',
    // enum: MonitoringStatus, // Comentado para SQLite
    default: MonitoringStatus.ACTIVE,
  })
  status: MonitoringStatus;

  @Column('simple-array')
  notificationChannels: NotificationChannel[];

  @Column({ default: true })
  notifyOnNewTender: boolean;

  @Column({ default: true })
  notifyOnStatusChange: boolean;

  @Column({ default: false })
  notifyOnDeadlineApproach: boolean;

  @Column({ default: 24 })
  deadlineNotificationHours: number;

  @Column({ type: 'time', nullable: true })
  notificationStartTime: string;

  @Column({ type: 'time', nullable: true })
  notificationEndTime: string;

  @Column('simple-array', { nullable: true })
  notificationDays: string[]; // ['monday', 'tuesday', etc.]

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'datetime', nullable: true })
  lastNotificationAt: Date;

  @Column({ default: 0 })
  totalNotificationsSent: number;

  @Column({ default: 0 })
  totalTendersFound: number;

  @Column('simple-json', { nullable: true })
  lastResults: Array<{
    tenderId: string;
    title: string;
    organization: string;
    value: number;
    foundAt: Date;
  }>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
