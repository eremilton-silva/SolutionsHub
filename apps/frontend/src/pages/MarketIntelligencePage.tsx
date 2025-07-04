import React from 'react';
import { TrendingUp, Search, Filter, Eye, Download, Calendar, MapPin, DollarSign } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../components/ui';

// Mock data para licitações do PNCP
const tenders = [
  {
    id: '001',
    title: 'Contratação de empresa para desenvolvimento de sistema de gestão municipal',
    organ: 'Prefeitura Municipal de São Paulo',
    modality: 'Pregão Eletrônico',
    value: 'R$ 2.500.000,00',
    publishDate: '2025-01-02',
    deadline: '2025-01-15',
    location: 'São Paulo, SP',
    status: 'Publicado',
    statusColor: 'bg-blue-100 text-blue-700',
    category: 'Tecnologia da Informação',
    score: 95
  },
  {
    id: '002',
    title: 'Aquisição de licenças de software para gestão de recursos humanos',
    organ: 'Secretaria de Estado da Administração - SP',
    modality: 'Concorrência',
    value: 'R$ 1.800.000,00',
    publishDate: '2025-01-03',
    deadline: '2025-01-20',
    location: 'São Paulo, SP',
    status: 'Publicado',
    statusColor: 'bg-blue-100 text-blue-700',
    category: 'Software e Licenças',
    score: 88
  },
  {
    id: '003',
    title: 'Modernização do sistema de controle de estoque hospitalar',
    organ: 'Hospital das Clínicas - FMUSP',
    modality: 'Pregão Eletrônico',
    value: 'R$ 950.000,00',
    publishDate: '2025-01-01',
    deadline: '2025-01-12',
    location: 'São Paulo, SP',
    status: 'Prazo Final',
    statusColor: 'bg-red-100 text-red-700',
    category: 'Sistema de Gestão',
    score: 92
  }
];

export const MarketIntelligencePage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Inteligência de Mercado</h1>
          <p className="text-text-secondary">Monitoramento em tempo real do PNCP e análise de tendências</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button className="btn-outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Dados
          </Button>
          <Button className="btn-primary">
            <Search className="h-4 w-4 mr-2" />
            Nova Busca
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Licitações Hoje</p>
                <p className="text-2xl font-bold text-text-primary">47</p>
                <p className="text-xs text-green-600 mt-1">+12% vs ontem</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Valor Total</p>
                <p className="text-2xl font-bold text-text-primary">R$ 28.5M</p>
                <p className="text-xs text-green-600 mt-1">+8% vs semana anterior</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Match Score Alto</p>
                <p className="text-2xl font-bold text-text-primary">23</p>
                <p className="text-xs text-primary-600 mt-1">Score {'>'} 85%</p>
              </div>
              <div className="h-8 w-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Órgãos Ativos</p>
                <p className="text-2xl font-bold text-text-primary">156</p>
                <p className="text-xs text-text-secondary mt-1">São Paulo e região</p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar por palavras-chave..."
                  className="input-field pl-10"
                />
              </div>
            </div>
            <select className="input-field">
              <option>Todas as Modalidades</option>
              <option>Pregão Eletrônico</option>
              <option>Concorrência</option>
              <option>Tomada de Preços</option>
            </select>
            <select className="input-field">
              <option>Todas as Categorias</option>
              <option>Tecnologia da Informação</option>
              <option>Software e Licenças</option>
              <option>Sistema de Gestão</option>
            </select>
            <select className="input-field">
              <option>Todos os Status</option>
              <option>Publicado</option>
              <option>Prazo Final</option>
              <option>Encerrado</option>
            </select>
            <button className="btn-secondary">
              <Filter className="h-4 w-4 mr-2" />
              Filtros Avançados
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Tenders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Licitações Monitoradas - PNCP</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-text-secondary">Última atualização: 14:35</span>
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-light">
                  <th className="table-header">Licitação</th>
                  <th className="table-header">Órgão</th>
                  <th className="table-header">Modalidade</th>
                  <th className="table-header">Valor</th>
                  <th className="table-header">Prazo</th>
                  <th className="table-header">Score</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Ações</th>
                </tr>
              </thead>
              <tbody>
                {tenders.map((tender) => (
                  <tr key={tender.id} className="border-b border-border-light hover:bg-background-secondary">
                    <td className="table-cell">
                      <div className="max-w-xs">
                        <p className="font-medium text-text-primary line-clamp-2">{tender.title}</p>
                        <p className="text-sm text-text-secondary mt-1">{tender.category}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div>
                        <p className="font-medium text-text-primary">{tender.organ}</p>
                        <div className="flex items-center text-sm text-text-secondary mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {tender.location}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm">{tender.modality}</span>
                    </td>
                    <td className="table-cell">
                      <span className="font-medium text-green-600">{tender.value}</span>
                    </td>
                    <td className="table-cell">
                      <div>
                        <p className="text-sm font-medium">{tender.deadline}</p>
                        <p className="text-xs text-text-secondary">Pub: {tender.publishDate}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full" 
                            style={{ width: `${tender.score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{tender.score}%</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`badge ${tender.statusColor}`}>
                        {tender.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-background-tertiary rounded-lg transition-colors" title="Ver detalhes">
                          <Eye className="h-4 w-4 text-text-secondary" />
                        </button>
                        <button className="p-2 hover:bg-background-tertiary rounded-lg transition-colors" title="Baixar edital">
                          <Download className="h-4 w-4 text-text-secondary" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};