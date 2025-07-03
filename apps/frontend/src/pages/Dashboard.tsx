import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  FileText, 
  Bell, 
  DollarSign,
  BarChart3,
  Calendar,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api.service';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClients: 0,
    activeOpportunities: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const clientStats = await apiService.getClientStats();
        setStats({
          totalClients: clientStats.total || 0,
          activeOpportunities: 89, // Mock data
          monthlyRevenue: 124500, // Mock data
          conversionRate: 24.5, // Mock data
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const statsData = [
    {
      title: 'Total de Clientes',
      value: stats.totalClients.toLocaleString(),
      change: '+12%',
      positive: true,
      icon: Users,
    },
    {
      title: 'Licitações Ativas',
      value: stats.activeOpportunities.toString(),
      change: '+5%',
      positive: true,
      icon: FileText,
    },
    {
      title: 'Receita Mensal',
      value: `R$ ${(stats.monthlyRevenue / 1000).toFixed(1)}K`,
      change: '+18%',
      positive: true,
      icon: DollarSign,
    },
    {
      title: 'Taxa de Conversão',
      value: `${stats.conversionRate}%`,
      change: '-2%',
      positive: false,
      icon: TrendingUp,
    },
  ];

  const modules = [
    {
      name: 'CRM',
      description: 'Gestão de clientes e relacionamentos',
      icon: Users,
      color: 'bg-blue-500',
      status: 'active',
      route: '/crm',
    },
    {
      name: 'Inteligência de Mercado',
      description: 'Monitoramento de licitações PNCP',
      icon: BarChart3,
      color: 'bg-green-500',
      status: 'active',
      route: '/market-intelligence',
    },
    {
      name: 'Oportunidades',
      description: 'Gestão de oportunidades de negócio',
      icon: TrendingUp,
      color: 'bg-purple-500',
      status: 'active',
      href: '/opportunities',
    },
    {
      name: 'Central de Alertas',
      description: 'Notificações e alertas personalizados',
      icon: Bell,
      color: 'bg-orange-500',
      status: 'development',
    },
    {
      name: 'Financeiro',
      description: 'Controle financeiro e faturamento',
      icon: DollarSign,
      color: 'bg-emerald-500',
      status: 'development',
    },
    {
      name: 'Gestão Documental',
      description: 'Documentos e assinaturas digitais',
      icon: FileText,
      color: 'bg-indigo-500',
      status: 'development',
    },
    {
      name: 'Produtividade',
      description: 'Kanban e gestão de tarefas',
      icon: Calendar,
      color: 'bg-pink-500',
      status: 'development',
    },
    {
      name: 'Configurações',
      description: 'Configurações do sistema',
      icon: Settings,
      color: 'bg-gray-500',
      status: 'active',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">SH</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Solution Hub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-medium text-sm">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo ao Solution Hub! 🚀
          </h2>
          <p className="text-gray-600">
            Sua plataforma completa para gestão de licitações e processos de licitação.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            // Loading skeletons
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 border animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="bg-gray-200 p-3 rounded-lg w-12 h-12"></div>
                </div>
              </div>
            ))
          ) : (
            statsData.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className={`text-sm mt-1 ${
                      stat.positive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change} vs mês anterior
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <stat.icon className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modules Grid */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Módulos do Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-sm p-6 border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => module.route && navigate(module.route)}
              >
                <div className="flex items-center mb-4">
                  <div className={`${module.color} p-2 rounded-lg mr-3`}>
                    <module.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{module.name}</h4>
                    <div className="flex items-center mt-1">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        module.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'
                      }`}></span>
                      <span className="text-xs text-gray-500">
                        {module.status === 'active' ? 'Ativo' : 'Em Desenvolvimento'}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{module.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/crm')}
              className="btn-primary text-left p-4"
            >
              <Users className="w-5 h-5 mb-2" />
              <span className="block font-medium">Gerenciar CRM</span>
              <span className="text-sm opacity-80">Acessar clientes e contratos</span>
            </button>
            <button 
              onClick={() => navigate('/market-intelligence')}
              className="btn-secondary text-left p-4"
            >
              <BarChart3 className="w-5 h-5 mb-2" />
              <span className="block font-medium">Licitações</span>
              <span className="text-sm opacity-80">Monitorar oportunidades</span>
            </button>
            <button className="btn-secondary text-left p-4">
              <FileText className="w-5 h-5 mb-2" />
              <span className="block font-medium">Relatórios</span>
              <span className="text-sm opacity-80">Visualizar métricas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
