import React from 'react';
import { Users, Plus, Search, Filter, MoreVertical, Mail, Phone } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../components/ui';

// Mock data para clientes
const clients = [
  {
    id: 1,
    name: 'Prefeitura de São Paulo',
    contact: 'João Silva',
    email: 'joao.silva@sp.gov.br',
    phone: '(11) 3333-4444',
    status: 'Ativo',
    statusColor: 'bg-green-100 text-green-700',
    plan: 'Premium',
    lastContact: '2025-01-03',
    opportunities: 12,
    revenue: 'R$ 150.000'
  },
  {
    id: 2,
    name: 'Governo do Estado de MG',
    contact: 'Maria Santos',
    email: 'maria.santos@mg.gov.br',
    phone: '(31) 2222-3333',
    status: 'Ativo',
    statusColor: 'bg-green-100 text-green-700',
    plan: 'Enterprise',
    lastContact: '2025-01-02',
    opportunities: 8,
    revenue: 'R$ 220.000'
  },
  {
    id: 3,
    name: 'Hospital das Clínicas',
    contact: 'Pedro Costa',
    email: 'pedro.costa@hc.usp.br',
    phone: '(11) 1111-2222',
    status: 'Prospect',
    statusColor: 'bg-yellow-100 text-yellow-700',
    plan: 'Basic',
    lastContact: '2024-12-28',
    opportunities: 3,
    revenue: 'R$ 45.000'
  }
];

export const CrmPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">CRM - Cliente 360°</h1>
          <p className="text-text-secondary">Gestão completa de clientes e relacionamentos</p>
        </div>
        <Button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Total de Clientes</p>
                <p className="text-2xl font-bold text-text-primary">89</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Clientes Ativos</p>
                <p className="text-2xl font-bold text-text-primary">67</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="h-3 w-3 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Novos este Mês</p>
                <p className="text-2xl font-bold text-text-primary">12</p>
              </div>
              <div className="h-8 w-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <Plus className="h-4 w-4 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Receita Total</p>
                <p className="text-2xl font-bold text-text-primary">R$ 2.1M</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-green-600">R$</span>
              </div>
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
                  placeholder="Buscar clientes..."
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="btn-secondary">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </button>
              <select className="input-field w-auto">
                <option>Todos os Status</option>
                <option>Ativo</option>
                <option>Prospect</option>
                <option>Inativo</option>
              </select>
              <select className="input-field w-auto">
                <option>Todos os Planos</option>
                <option>Basic</option>
                <option>Premium</option>
                <option>Enterprise</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-light">
                  <th className="table-header">Cliente</th>
                  <th className="table-header">Contato</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Plano</th>
                  <th className="table-header">Oportunidades</th>
                  <th className="table-header">Receita</th>
                  <th className="table-header">Último Contato</th>
                  <th className="table-header">Ações</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b border-border-light hover:bg-background-secondary">
                    <td className="table-cell">
                      <div>
                        <p className="font-medium text-text-primary">{client.name}</p>
                        <p className="text-sm text-text-secondary">{client.contact}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-2 text-text-secondary" />
                          {client.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-2 text-text-secondary" />
                          {client.phone}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`badge ${client.statusColor}`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="font-medium">{client.plan}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-center font-medium">{client.opportunities}</span>
                    </td>
                    <td className="table-cell">
                      <span className="font-medium text-green-600">{client.revenue}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm">{client.lastContact}</span>
                    </td>
                    <td className="table-cell">
                      <button className="p-2 hover:bg-background-tertiary rounded-lg transition-colors">
                        <MoreVertical className="h-4 w-4 text-text-secondary" />
                      </button>
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