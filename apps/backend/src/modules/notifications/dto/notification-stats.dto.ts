export class NotificationStatsDto {
  total: number;
  pending: number;
  sent: number;
  delivered: number;
  failed: number;
  read: number;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
  recentActivity: {
    date: string;
    count: number;
  }[];
}
