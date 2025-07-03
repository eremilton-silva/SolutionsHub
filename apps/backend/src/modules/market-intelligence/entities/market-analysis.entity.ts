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

export enum AnalysisType {
  MARKET_OVERVIEW = 'market_overview',
  COMPETITION_ANALYSIS = 'competition_analysis',
  TREND_ANALYSIS = 'trend_analysis',
  OPPORTUNITY_MAPPING = 'opportunity_mapping',
  PRICE_ANALYSIS = 'price_analysis',
}

export enum AnalysisStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('market_analysis')
@Index(['type', 'status'])
@Index(['createdAt'])
export class MarketAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: AnalysisType,
  })
  type: AnalysisType;

  @Column({
    type: 'enum',
    enum: AnalysisStatus,
    default: AnalysisStatus.PENDING,
  })
  status: AnalysisStatus;

  @Column('simple-json', { nullable: true })
  parameters: {
    dateRange?: {
      startDate: Date;
      endDate: Date;
    };
    filters?: {
      organizations?: string[];
      categories?: string[];
      valueRange?: {
        min: number;
        max: number;
      };
      states?: string[];
      municipalities?: string[];
    };
    keywords?: string[];
  };

  @Column('simple-json', { nullable: true })
  results: {
    summary?: {
      totalTenders: number;
      totalValue: number;
      averageValue: number;
      topOrganizations: Array<{
        name: string;
        count: number;
        totalValue: number;
      }>;
      topCategories: Array<{
        name: string;
        count: number;
        totalValue: number;
      }>;
    };
    trends?: {
      monthly: Array<{
        month: string;
        count: number;
        value: number;
      }>;
      growth: {
        tendersGrowth: number;
        valueGrowth: number;
      };
    };
    competition?: {
      competitors: Array<{
        name: string;
        marketShare: number;
        winRate: number;
        averageBidValue: number;
      }>;
      marketConcentration: number;
    };
    opportunities?: {
      highValueTenders: Array<{
        id: string;
        title: string;
        organization: string;
        value: number;
        deadline: Date;
        relevanceScore: number;
      }>;
      emergingCategories: Array<{
        category: string;
        growth: number;
        averageValue: number;
      }>;
    };
    priceAnalysis?: {
      averagePrices: Array<{
        category: string;
        item: string;
        averagePrice: number;
        priceRange: {
          min: number;
          max: number;
        };
        samples: number;
      }>;
      priceVariation: number;
    };
  };

  @Column('simple-json', { nullable: true })
  charts: Array<{
    type: string;
    title: string;
    data: any;
    config: any;
  }>;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date;

  @Column({ type: 'int', default: 0 })
  processingTime: number; // in seconds

  @Column('text', { nullable: true })
  errorMessage: string;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ default: 0 })
  viewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
