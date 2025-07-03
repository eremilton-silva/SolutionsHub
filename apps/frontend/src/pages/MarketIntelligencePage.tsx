import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Target, 
  TrendingUp, 
  MapPin, 
  Calendar, 
  DollarSign,
  Building,
  FileText,
  Settings,
  Play,
  Pause,
  Plus
} from 'lucide-react';
import { apiService } from '../services/api.service';

interface Tender {
  id: string;
  title: string;
  organizationName: string;
  organizationState: string;
  type: string;
  status: string;
  estimatedValue: number;
  publishDate: string;
  proposalDeadline: string;
  relevanceScore: number;
  isOpportunity: boolean;
  isMonitored: boolean;
}

interface TenderMonitoring {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  status: 'active' | 'paused' | 'stopped';
  totalTendersFound: number;
  totalNotificationsSent: number;
  lastNotificationAt: string;
  createdAt: string;
}

interface DashboardStats {
  totalTenders: number;
  openTenders: number;
  monitoredTenders: number;
  opportunities: number;
  totalValue: number;
  tendersThisMonth: number;
  growth: number;
}

const MarketIntelligencePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tenders' | 'monitoring' | 'analysis'>('dashboard');
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [monitorings, setMonitorings] = useState<TenderMonitoring[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    state: '',
    valueMin: '',
    valueMax: '',
  });

  // Carregar dados iniciais
  useEffect(() => {
    loadDashboardStats();
    if (activeTab === 'tenders') {
      loadTenders();
    } else if (activeTab === 'monitoring') {
      loadMonitorings();
    }
  }, [activeTab]);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMarketStats();
      setStats(response);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTenders = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (filters.status) params.status = filters.status;
      if (filters.type) params.type = filters.type;
      if (filters.state) params.organizationState = filters.state;
      if (filters.valueMin) params.valueMin = parseFloat(filters.valueMin);
      if (filters.valueMax) params.valueMax = parseFloat(filters.valueMax);

      const response = await apiService.getTenders(params);
      setTenders(response.data);
    } catch (error) {
      console.error('Error loading tenders:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMonitorings = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMonitorings();
      setMonitorings(response);
    } catch (error) {
      console.error('Error loading monitorings:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsOpportunity = async (tenderId: string) => {
    try {
      await apiService.markTenderAsOpportunity(tenderId);
      loadTenders();
    } catch (error) {
      console.error('Error marking as opportunity:', error);
    }
  };

  const toggleMonitoring = async (monitoringId: string, currentStatus: string) => {
    try {
      if (currentStatus === 'active') {
        await apiService.pauseMonitoring(monitoringId);
      } else {
        await apiService.resumeMonitoring(monitoringId);
      }
      loadMonitorings();
    } catch (error) {
      console.error('Error toggling monitoring:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-green-100 text-green-800',
      published: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      suspended: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Licitações</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalTenders || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Licitações Abertas</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.openTenders || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Oportunidades</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.opportunities || 0}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats?.totalValue || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Growth Indicator */}
      {stats && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Crescimento Este Mês</h3>
              <p className="text-sm text-gray-600">
                {stats.tendersThisMonth} licitações este mês
              </p>
            </div>
            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              stats.growth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <TrendingUp className={`w-4 h-4 mr-1 ${stats.growth < 0 ? 'rotate-180' : ''}`} />
              {Math.abs(stats.growth)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTenders = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar licitações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Todos os Status</option>
              <option value="open">Aberta</option>
              <option value="published">Publicada</option>
              <option value="cancelled">Cancelada</option>
            </select>
            <button
              onClick={loadTenders}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtrar
            </button>
          </div>
        </div>
      </div>

      {/* Tenders List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Licitações Encontradas</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {tenders.map((tender) => (
            <div key={tender.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {tender.title}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tender.status)}`}>
                      {tender.status}
                    </span>
                    {tender.isOpportunity && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        Oportunidade
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      {tender.organizationName}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {tender.organizationState}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {formatCurrency(tender.estimatedValue)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(tender.proposalDeadline)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <div className={`w-2 h-2 rounded-full ${tender.relevanceScore >= 70 ? 'bg-green-500' : tender.relevanceScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                  <span className="text-xs text-gray-500">{tender.relevanceScore}%</span>
                  <button
                    onClick={() => markAsOpportunity(tender.id)}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                    title="Marcar como Oportunidade"
                  >
                    <Target className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMonitoring = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Monitoramento de Licitações</h2>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Monitoramento
        </button>
      </div>

      {/* Monitoring List */}
      <div className="grid gap-6">
        {monitorings.map((monitoring) => (
          <div key={monitoring.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{monitoring.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    monitoring.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {monitoring.status === 'active' ? 'Ativo' : 'Pausado'}
                  </span>
                </div>
                {monitoring.description && (
                  <p className="text-sm text-gray-600 mb-3">{monitoring.description}</p>
                )}
                <div className="flex flex-wrap gap-1 mb-3">
                  {monitoring.keywords.map((keyword, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                      {keyword}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Licitações:</span> {monitoring.totalTendersFound}
                  </div>
                  <div>
                    <span className="font-medium">Notificações:</span> {monitoring.totalNotificationsSent}
                  </div>
                  <div>
                    <span className="font-medium">Criado em:</span> {formatDate(monitoring.createdAt)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => toggleMonitoring(monitoring.id, monitoring.status)}
                  className={`p-2 rounded-lg ${
                    monitoring.status === 'active' 
                      ? 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50' 
                      : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                  }`}
                  title={monitoring.status === 'active' ? 'Pausar' : 'Reativar'}
                >
                  {monitoring.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inteligência de Mercado</h1>
              <p className="text-sm text-gray-600">
                Monitore licitações e identifique oportunidades de negócio
              </p>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'tenders', label: 'Licitações', icon: FileText },
              { id: 'monitoring', label: 'Monitoramento', icon: Eye },
              { id: 'analysis', label: 'Análises', icon: Target },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-1 py-4 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        )}
        
        {!loading && (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'tenders' && renderTenders()}
            {activeTab === 'monitoring' && renderMonitoring()}
            {activeTab === 'analysis' && (
              <div className="text-center py-12">
                <Target className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Análises de Mercado</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Em breve: análises automáticas de tendências e oportunidades
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MarketIntelligencePage;
