import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  FileText,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui';

const DashboardStats = [
  {
    title: 'Licitações Ativas',
    value: '142',
    change: '+12%',
    changeType: 'positive' as const,
    icon: Target,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Clientes Ativos',
    value: '89',
    change: '+8%',
    changeType: 'positive' as const,
    icon: Users,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    title: 'Propostas Enviadas',
    value: '67',
    change: '+15%',
    changeType: 'positive' as const,
    icon: FileText,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    title: 'Receita do Mês',
    value: 'R$ 485.2K',
    change: '-3%',
    changeType: 'negative' as const,
    icon: DollarSign,
    color: 'text-primary-600',
    bgColor: 'bg-primary-50'
  }
];

const RecentTenders = [
  {
    id: '001',
    title: 'Licitação para Sistema de Gestão Municipal',
    organ: 'Prefeitura de São Paulo',
    value: 'R$ 2.500.000,00',
    deadline: '2025-01-15',
    status: 'Aguardando Proposta',
    statusColor: 'bg-yellow-100 text-yellow-700'
  },
  {
    id: '002',
    title: 'Modernização de Software de RH',
    organ: 'Governo do Estado de SP',
    value: 'R$ 1.800.000,00',
    deadline: '2025-01-20',
    status: 'Em Análise',
    statusColor: 'bg-blue-100 text-blue-700'
  },
  {
    id: '003',
    title: 'Sistema de Controle de Estoque',
    organ: 'Hospital das Clínicas',
    value: 'R$ 950.000,00',
    deadline: '2025-01-12',
    status: 'Proposta Enviada',
    statusColor: 'bg-green-100 text-green-700'
  }
];

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary">Visão geral das suas atividades e métricas</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn-outline">
            <Calendar className="h-4 w-4 mr-2" />
            Últimos 30 dias
          </button>
          <button className="btn-primary">
            Ver Relatório Completo
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DashboardStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">{stat.title}</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.changeType === 'positive' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ml-1 ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-text-secondary ml-1">vs mês anterior</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tenders */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Licitações Recentes</span>
                <button className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                  Ver todas
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border-light">
                {RecentTenders.map((tender) => (
                  <div key={tender.id} className="p-6 hover:bg-background-secondary transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-text-primary">{tender.title}</h3>
                        <p className="text-sm text-text-secondary mt-1">{tender.organ}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm font-medium text-text-primary">{tender.value}</span>
                          <span className="text-sm text-text-secondary">Prazo: {tender.deadline}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${tender.statusColor}`}>
                          {tender.status}
                        </span>
                        <button className="text-text-secondary hover:text-text-primary">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts and Quick Actions */}
        <div className="space-y-6">
          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 text-primary-500 mr-2" />
                Alertas Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-800">3 propostas vencem hoje</p>
                <p className="text-xs text-red-600 mt-1">Verifique os prazos de entrega</p>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium text-yellow-800">5 novas licitações disponíveis</p>
                <p className="text-xs text-yellow-600 mt-1">Revise e assign aos consultores</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Relatório mensal disponível</p>
                <p className="text-xs text-blue-600 mt-1">Análise de performance dezembro</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full btn-primary text-left">
                Nova Proposta
              </button>
              <button className="w-full btn-secondary text-left">
                Adicionar Cliente
              </button>
              <button className="w-full btn-secondary text-left">
                Importar Licitações
              </button>
              <button className="w-full btn-secondary text-left">
                Gerar Relatório
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};