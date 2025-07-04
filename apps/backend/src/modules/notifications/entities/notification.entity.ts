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

export enum NotificationType {
  SYSTEM = 'system',
  EMAIL = 'email',
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  PUSH = 'push',
  IN_APP = 'in_app',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
}

export enum NotificationCategory {
  TENDER_ALERT = 'tender_alert',
  OPPORTUNITY_UPDATE = 'opportunity_update',
  CLIENT_UPDATE = 'client_update',
  DEADLINE_REMINDER = 'deadline_reminder',
  FOLLOW_UP = 'follow_up',
  SYSTEM_UPDATE = 'system_update',
  MARKETING = 'marketing',
  SECURITY = 'security',
}

@Entity('notifications')
@Index(['userId', 'status'])
@Index(['type', 'status'])
@Index(['category', 'status'])
@Index(['scheduledAt'])
@Index(['priority', 'status'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column({
    type: 'varchar',
    // enum: NotificationType, // Comentado para SQLite
    default: NotificationType.IN_APP,
  })
  type: NotificationType;

  @Column({
    type: 'varchar',
    // enum: NotificationPriority, // Comentado para SQLite
    default: NotificationPriority.MEDIUM,
  })
  priority: NotificationPriority;

  @Column({
    type: 'varchar',
    // enum: NotificationStatus, // Comentado para SQLite
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  @Column({
    type: 'varchar',
    // enum: NotificationCategory, // Comentado para SQLite
  })
  category: NotificationCategory;

  // Destinatário da notificação
  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  // Dados específicos para cada tipo de notificação
  @Column('simple-json', { nullable: true })
  data: {
    // Para email
    emailTo?: string;
    emailFrom?: string;
    emailSubject?: string;
    emailTemplate?: string;
    
    // Para SMS/WhatsApp
    phoneNumber?: string;
    
    // Para push notifications
    deviceToken?: string;
    
    // Para notificações do sistema
    actionUrl?: string;
    relatedEntityType?: string;
    relatedEntityId?: string;
    
    // Dados customizados
    [key: string]: any;
  };

  // Configurações de entrega
  @Column({ type: 'datetime', nullable: true })
  scheduledAt: Date;

  @Column({ type: 'datetime', nullable: true })
  sentAt: Date;

  @Column({ type: 'datetime', nullable: true })
  deliveredAt: Date;

  @Column({ type: 'datetime', nullable: true })
  readAt: Date;

  @Column({ type: 'datetime', nullable: true })
  failedAt: Date;

  // Configurações de retry
  @Column({ type: 'int', default: 0 })
  retryCount: number;

  @Column({ type: 'int', default: 3 })
  maxRetries: number;

  @Column({ type: 'datetime', nullable: true })
  nextRetryAt: Date;

  // Log de erros
  @Column('text', { nullable: true })
  errorMessage: string;

  @Column('simple-json', { nullable: true })
  errorDetails: any;

  // Configurações de expiração
  @Column({ type: 'datetime', nullable: true })
  expiresAt: Date;

  // Metadados
  @Column('simple-json', { nullable: true })
  metadata: {
    source?: string;
    campaign?: string;
    tags?: string[];
    [key: string]: any;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Métodos auxiliares
  isExpired(): boolean {
    return this.expiresAt ? new Date() > this.expiresAt : false;
  }

  canRetry(): boolean {
    return this.retryCount < this.maxRetries && 
           this.status === NotificationStatus.FAILED && 
           !this.isExpired();
  }

  getNextRetryDelay(): number {
    // Backoff exponencial: 2^retry_count minutos
    return Math.pow(2, this.retryCount) * 60 * 1000;
  }
}
