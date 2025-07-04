import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui';
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Plus,
  Eye,
  FileText,
  Bell,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const stats = [
    {
      title: 'Clientes Ativos',
      value: '1,247',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Licitações Monitoradas',
      value: '89',
      change: '+5%',
      changeType: 'positive' as const,
      icon: Target,
      color: 'green'
    },
    {
      title: 'Propostas em Andamento',
      value: '23',
      change: '-2%',
      changeType: 'negative' as const,
      icon: Clock,
      color: 'orange'
    },
    {
      title: 'Faturamento Mensal',
      value: 'R$ 245.000',
      change: '+18%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'yellow'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      title: 'Nova licitação PNCP detectada',
      description: 'Pregão Eletrônico nº 001/2024 - Prefeitura de São Paulo',
      time: '5 min atrás',
      type: 'opportunity',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Proposta enviada com sucesso',
      description: 'Cliente: Empresa ABC - Licitação: PE 045/2024',
      time: '1 hora atrás',
      type: 'success',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Reunião agendada',
      description: 'Cliente: XYZ Corp - Análise de nova oportunidade',
      time: '2 horas atrás',
      type: 'meeting',
      priority: 'low'
    },
    {
      id: 4,
      title: 'Documento assinado digitalmente',
      description: 'Contrato de consultoria - Empresa DEF',
      time: '3 horas atrás',
      type: 'document',
      priority: 'medium'
    }
  ];

  const quickActions = [
    {
      title: 'Nova Oportunidade',
      description: 'Cadastrar nova licitação',
      icon: Plus,
      color: 'primary',
      action: '/opportunities/new'
    },
    {
      title: 'Consultar PNCP',
      description: 'Buscar licitações públicas',
      icon: Eye,
      color: 'blue',
      action: '/market-intelligence'
    },
    {
      title: 'Adicionar Cliente',
      description: 'Novo cliente no CRM',
      icon: Users,
      color: 'green',
      action: '/crm/new'
    },
    {
      title: 'Gerar Relatório',
      description: 'Relatórios e análises',
      icon: FileText,
      color: 'purple',
      action: '/analytics/reports'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary mt-1">Bem-vindo ao Solution Hub - Visão geral das suas atividades</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Relatórios
          </button>
          <button className="btn-primary flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Análise Avançada
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-secondary mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-text-primary mb-2">{stat.value}</p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    stat.changeType === 'positive' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {stat.changeType === 'positive' ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${
                  stat.color === 'blue' ? 'bg-blue-100' :
                  stat.color === 'green' ? 'bg-green-100' :
                  stat.color === 'orange' ? 'bg-orange-100' :
                  'bg-yellow-100'
                }`}>
                  <stat.icon className={`h-7 w-7 ${
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'orange' ? 'text-orange-600' :
                    'text-yellow-600'
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary-500" />
              Atividades Recentes
            </CardTitle>
            <button className="text-sm text-primary-500 hover:text-primary-600 font-medium">
              Ver todas
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg border border-border-light hover:bg-background-secondary transition-all duration-200 hover:border-primary-200">
                  <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                    activity.priority === 'high' ? 'bg-red-500' :
                    activity.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-text-primary text-sm">{activity.title}</h4>
                    <p className="text-sm text-text-secondary mt-1 line-clamp-2">{activity.description}</p>
                    <p className="text-xs text-text-secondary mt-2 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {activity.type === 'opportunity' && <Target className="h-5 w-5 text-primary-500" />}
                    {activity.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {activity.type === 'meeting' && <Calendar className="h-5 w-5 text-blue-500" />}
                    {activity.type === 'document' && <FileText className="h-5 w-5 text-purple-500" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary-500" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <button 
                  key={index}
                  className="w-full p-4 text-left rounded-lg border border-border-light hover:border-primary-200 hover:bg-primary-50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      action.color === 'primary' ? 'bg-primary-100 group-hover:bg-primary-200' :
                      action.color === 'blue' ? 'bg-blue-100 group-hover:bg-blue-200' :
                      action.color === 'green' ? 'bg-green-100 group-hover:bg-green-200' :
                      'bg-purple-100 group-hover:bg-purple-200'
                    }`}>
                      <action.icon className={`h-5 w-5 ${
                        action.color === 'primary' ? 'text-primary-600' :
                        action.color === 'blue' ? 'text-blue-600' :
                        action.color === 'green' ? 'text-green-600' :
                        'text-purple-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-text-primary text-sm">{action.title}</h4>
                      <p className="text-xs text-text-secondary">{action.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
