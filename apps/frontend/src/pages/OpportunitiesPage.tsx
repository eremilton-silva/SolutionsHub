import React from 'react';
import { Target, Plus, Search, Filter, Eye, Edit, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../components/ui';

// Mock data para oportunidades
const opportunities = [
  {
    id: '001',
    title: 'Sistema de Gestão Municipal - Prefeitura SP',
    client: 'Prefeitura de São Paulo',
    value: 'R$ 2.500.000,00',
    probability: 85,
    stage: 'Proposta Enviada',
    stageColor: 'bg-blue-100 text-blue-700',
    deadline: '2025-01-15',
    assignedTo: 'João Silva',
    createdAt: '2024-12-20',
    nextAction: 'Acompanhar resposta',
    nextActionDate: '2025-01-08'
  },
  {
    id: '002',
    title: 'Modernização Sistema RH - Governo MG',
    client: 'Governo do Estado de MG',
    value: 'R$ 1.800.000,00',
    probability: 60,
    stage: 'Em Análise',
    stageColor: 'bg-yellow-100 text-yellow-700',
    deadline: '2025-01-20',
    assignedTo: 'Maria Santos',
    createdAt: '2024-12-18',
    nextAction: 'Elaborar proposta técnica',
    nextActionDate: '2025-01-10'
  },
  {
    id: '003',
    title: 'Sistema Controle Estoque - Hospital',
    client: 'Hospital das Clínicas',
    value: 'R$ 950.000,00',
    probability: 95,
    stage: 'Negociação Final',
    stageColor: 'bg-green-100 text-green-700',
    deadline: '2025-01-12',
    assignedTo: 'Pedro Costa',
    createdAt: '2024-12-15',
    nextAction: 'Assinatura do contrato',
    nextActionDate: '2025-01-09'
  },
  {
    id: '004',
    title: 'Portal Transparência - Câmara Municipal',
    client: 'Câmara Municipal de Santos',
    value: 'R$ 450.000,00',
    probability: 30,
    stage: 'Primeira Reunião',
    stageColor: 'bg-purple-100 text-purple-700',
    deadline: '2025-01-25',
    assignedTo: 'Ana Silva',
    createdAt: '2025-01-02',
    nextAction: 'Reunião de descoberta',
    nextActionDate: '2025-01-07'
  }
];

const getStageIcon = (stage: string) => {
  switch (stage) {
    case 'Primeira Reunião':
      return <Clock className="h-4 w-4" />;
    case 'Em Análise':
      return <AlertCircle className="h-4 w-4" />;
    case 'Proposta Enviada':
      return <Eye className="h-4 w-4" />;
    case 'Negociação Final':
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <Target className="h-4 w-4" />;
  }
};

export const OpportunitiesPage: React.FC = () => {
  const totalValue = opportunities.reduce((sum, opp) => {
    const value = parseFloat(opp.value.replace('R$ ', '').replace('.', '').replace(',', '.'));
    return sum + value;
  }, 0);

  const averageProbability = opportunities.reduce((sum, opp) => sum + opp.probability, 0) / opportunities.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Gestão de Oportunidades</h1>
          <p className="text-text-secondary">Acompanhe e gerencie todas as oportunidades de negócio</p>
        </div>
        <Button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Nova Oportunidade
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Total de Oportunidades</p>
                <p className="text-2xl font-bold text-text-primary">{opportunities.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Valor Total Pipeline</p>
                <p className="text-2xl font-bold text-text-primary">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(totalValue)}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-green-600">R$</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Probabilidade Média</p>
                <p className="text-2xl font-bold text-text-primary">{Math.round(averageProbability)}%</p>
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
                <p className="text-sm font-medium text-text-secondary">Fechamento Previsto</p>
                <p className="text-2xl font-bold text-text-primary">12</p>
                <p className="text-xs text-green-600 mt-1">Este mês</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar oportunidades..."
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select className="input-field w-auto">
                <option>Todos os Estágios</option>
                <option>Primeira Reunião</option>
                <option>Em Análise</option>
                <option>Proposta Enviada</option>
                <option>Negociação Final</option>
              </select>
              <select className="input-field w-auto">
                <option>Todos os Responsáveis</option>
                <option>João Silva</option>
                <option>Maria Santos</option>
                <option>Pedro Costa</option>
                <option>Ana Silva</option>
              </select>
              <button className="btn-secondary">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opportunities Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline de Oportunidades</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-light">
                  <th className="table-header">Oportunidade</th>
                  <th className="table-header">Cliente</th>
                  <th className="table-header">Valor</th>
                  <th className="table-header">Probabilidade</th>
                  <th className="table-header">Estágio</th>
                  <th className="table-header">Responsável</th>
                  <th className="table-header">Próxima Ação</th>
                  <th className="table-header">Prazo</th>
                  <th className="table-header">Ações</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((opportunity) => (
                  <tr key={opportunity.id} className="border-b border-border-light hover:bg-background-secondary">
                    <td className="table-cell">
                      <div className="max-w-xs">
                        <p className="font-medium text-text-primary">{opportunity.title}</p>
                        <p className="text-sm text-text-secondary">Criado em {opportunity.createdAt}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="font-medium">{opportunity.client}</span>
                    </td>
                    <td className="table-cell">
                      <span className="font-medium text-green-600">{opportunity.value}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full" 
                            style={{ width: `${opportunity.probability}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{opportunity.probability}%</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center">
                        <span className={`badge ${opportunity.stageColor} mr-2`}>
                          {getStageIcon(opportunity.stage)}
                        </span>
                        <span className="text-sm">{opportunity.stage}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm">{opportunity.assignedTo}</span>
                    </td>
                    <td className="table-cell">
                      <div>
                        <p className="text-sm font-medium">{opportunity.nextAction}</p>
                        <p className="text-xs text-text-secondary">{opportunity.nextActionDate}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm font-medium">{opportunity.deadline}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-background-tertiary rounded-lg transition-colors" title="Ver detalhes">
                          <Eye className="h-4 w-4 text-text-secondary" />
                        </button>
                        <button className="p-2 hover:bg-background-tertiary rounded-lg transition-colors" title="Editar">
                          <Edit className="h-4 w-4 text-text-secondary" />
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