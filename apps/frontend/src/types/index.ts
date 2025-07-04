export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  avatar?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive' | 'prospect';
  plan?: 'basic' | 'premium' | 'enterprise';
  createdAt: string;
  lastContact?: string;
}

export interface Tender {
  id: string;
  title: string;
  description: string;
  entity: string;
  modality: string;
  value: number;
  deadline: string;
  status: 'open' | 'closed' | 'in_progress' | 'finalized';
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Opportunity {
  id: string;
  tenderId: string;
  clientId: string;
  title: string;
  description: string;
  status: 'new' | 'in_progress' | 'proposal_sent' | 'won' | 'lost';
  value: number;
  probability: number;
  assignedTo: string;
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  userId: string;
}

export interface DashboardStats {
  totalClients: number;
  activeOpportunities: number;
  monthlyRevenue: number;
  conversionRate: number;
  newTenders: number;
  activeTenders: number;
}
