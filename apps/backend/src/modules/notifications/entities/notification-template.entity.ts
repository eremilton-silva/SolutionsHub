import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { NotificationType, NotificationCategory } from './notification.entity';

@Entity('notification_templates')
@Index(['type', 'category'])
@Index(['isActive'])
export class NotificationTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({
    type: 'varchar',
    // enum: NotificationType, // Comentado para SQLite
  })
  type: NotificationType;

  @Column({
    type: 'varchar',
    // enum: NotificationCategory, // Comentado para SQLite
  })
  category: NotificationCategory;

  // Template do assunto (para email)
  @Column({ nullable: true })
  subject: string;

  // Template do corpo da mensagem
  @Column('text')
  template: string;

  // Template HTML (para email)
  @Column('text', { nullable: true })
  htmlTemplate: string;

  // Variáveis disponíveis no template
  @Column('simple-json', { nullable: true })
  variables: Array<{
    name: string;
    description: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'object';
    required: boolean;
    defaultValue?: any;
    example?: any;
  }>;

  // Configurações específicas do tipo
  @Column('simple-json', { nullable: true })
  config: {
    // Para email
    fromEmail?: string;
    fromName?: string;
    replyTo?: string;
    
    // Para SMS/WhatsApp
    senderId?: string;
    
    // Para push notifications
    icon?: string;
    sound?: string;
    badge?: number;
    
    // Configurações gerais
    priority?: string;
    ttl?: number; // Time to live em segundos
    [key: string]: any;
  };

  // Condições para envio automático
  @Column('simple-json', { nullable: true })
  conditions: {
    triggers?: Array<{
      event: string;
      entity: string;
      field?: string;
      operator?: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
      value?: any;
    }>;
    schedule?: {
      type: 'immediate' | 'delayed' | 'scheduled' | 'recurring';
      delay?: number; // em minutos
      cronExpression?: string;
    };
    filters?: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
  };

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isSystem: boolean; // Templates do sistema não podem ser editados

  // Estatísticas
  @Column({ type: 'int', default: 0 })
  sentCount: number;

  @Column({ type: 'int', default: 0 })
  deliveredCount: number;

  @Column({ type: 'int', default: 0 })
  readCount: number;

  @Column({ type: 'int', default: 0 })
  failedCount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  deliveryRate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  readRate: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Métodos auxiliares
  renderTemplate(variables: Record<string, any>): string {
    let rendered = this.template;
    
    // Substituir variáveis no formato {{variableName}}
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      rendered = rendered.replace(regex, String(value || ''));
    });
    
    return rendered;
  }

  renderHtmlTemplate(variables: Record<string, any>): string {
    if (!this.htmlTemplate) return '';
    
    let rendered = this.htmlTemplate;
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      rendered = rendered.replace(regex, String(value || ''));
    });
    
    return rendered;
  }

  validateVariables(variables: Record<string, any>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!this.variables) {
      return { valid: true, errors: [] };
    }
    
    // Verificar variáveis obrigatórias
    this.variables.forEach(variable => {
      if (variable.required && !variables.hasOwnProperty(variable.name)) {
        errors.push(`Variável obrigatória '${variable.name}' não fornecida`);
      }
      
      // Verificar tipo
      if (variables.hasOwnProperty(variable.name)) {
        const value = variables[variable.name];
        const expectedType = variable.type;
        
        if (expectedType === 'number' && isNaN(Number(value))) {
          errors.push(`Variável '${variable.name}' deve ser um número`);
        } else if (expectedType === 'date' && isNaN(Date.parse(value))) {
          errors.push(`Variável '${variable.name}' deve ser uma data válida`);
        } else if (expectedType === 'boolean' && typeof value !== 'boolean') {
          errors.push(`Variável '${variable.name}' deve ser um booleano`);
        }
      }
    });
    
    return { valid: errors.length === 0, errors };
  }

  updateStats(status: 'sent' | 'delivered' | 'read' | 'failed'): void {
    switch (status) {
      case 'sent':
        this.sentCount++;
        break;
      case 'delivered':
        this.deliveredCount++;
        break;
      case 'read':
        this.readCount++;
        break;
      case 'failed':
        this.failedCount++;
        break;
    }
    
    // Recalcular taxas
    if (this.sentCount > 0) {
      this.deliveryRate = (this.deliveredCount / this.sentCount) * 100;
      this.readRate = (this.readCount / this.deliveredCount) * 100;
    }
  }
}
