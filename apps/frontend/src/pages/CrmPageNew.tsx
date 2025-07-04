import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '../components/ui';
import { 
  Users, 
  Plus, 
  Search,
  Filter,
  UserPlus,
  Phone,
  Mail,
  Building,
  MapPin,
  Calendar,
  Star,
  Eye,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react';

export const CrmPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const clients = [
    {
      id: 1,
      name: 'Empresa ABC Ltda',
      contact: 'João Silva',
      email: 'joao@empresaabc.com',
      phone: '(11) 99999-9999',
      city: 'São Paulo',
      status: 'active',
      contracts: 3,
      revenue: 'R$ 150.000',
      lastContact: '2024-07-01',
      rating: 5
    },
    {
      id: 2,
      name: 'Tech Solutions Inc',
      contact: 'Maria Santos',
      email: 'maria@techsolutions.com',
      phone: '(21) 88888-8888',
      city: 'Rio de Janeiro',
      status: 'prospect',
      contracts: 0,
      revenue: 'R$ 0',
      lastContact: '2024-06-28',
      rating: 4
    },
    {
      id: 3,
      name: 'Construtora XYZ',
      contact: 'Carlos Mendes',
      email: 'carlos@construtoraXYZ.com',
      phone: '(31) 77777-7777',
      city: 'Belo Horizonte',
      status: 'active',
      contracts: 2,
      revenue: 'R$ 89.000',
      lastContact: '2024-06-30',
      rating: 4
    },
    {
      id: 4,
      name: 'Digital Marketing Pro',
      contact: 'Ana Paula',
      email: 'ana@digitalmarketing.com',
      phone: '(85) 66666-6666',
      city: 'Fortaleza',
      status: 'inactive',
      contracts: 1,
      revenue: 'R$ 25.000',
      lastContact: '2024-05-15',
      rating: 3
    }
  ];

  const stats = [
    {
      title: 'Total de Clientes',
      value: '1,247',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Clientes Ativos',
      value: '891',
      change: '+8%',
      changeType: 'positive' as const,
      icon: Star,
      color: 'green'
    },
    {
      title: 'Prospects',
      value: '156',
      change: '+23%',
      changeType: 'positive' as const,
      icon: UserPlus,
      color: 'yellow'
    },
    {
      title: 'Receita Total',
      value: 'R$ 2.1M',
      change: '+15%',
      changeType: 'positive' as const,
      icon: Building,
      color: 'purple'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: 'Ativo', class: 'badge-success' },
      prospect: { label: 'Prospect', class: 'badge-warning' },
      inactive: { label: 'Inativo', class: 'badge-danger' }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap];
    return (
      <span className={`badge ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">CRM - Cliente 360°</h1>
          <p className="text-text-secondary mt-1">Gestão completa de clientes e relacionamentos</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-secondary mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-text-primary mb-2">{stat.value}</p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    stat.changeType === 'positive' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    ↗ {stat.change}
                  </div>
                </div>
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                  stat.color === 'blue' ? 'bg-blue-100' :
                  stat.color === 'green' ? 'bg-green-100' :
                  stat.color === 'yellow' ? 'bg-yellow-100' :
                  'bg-purple-100'
                }`}>
                  <stat.icon className={`h-6 w-6 ${
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'yellow' ? 'text-yellow-600' :
                    'text-purple-600'
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
                <Input
                  placeholder="Buscar clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field min-w-32"
              >
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="prospect">Prospects</option>
                <option value="inactive">Inativos</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary-500" />
              Clientes ({filteredClients.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-light">
                  <th className="table-header text-left">Cliente</th>
                  <th className="table-header text-left">Contato</th>
                  <th className="table-header text-left">Localização</th>
                  <th className="table-header text-left">Status</th>
                  <th className="table-header text-left">Contratos</th>
                  <th className="table-header text-left">Receita</th>
                  <th className="table-header text-left">Último Contato</th>
                  <th className="table-header text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="border-b border-border-light hover:bg-background-secondary transition-colors">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Building className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{client.name}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${
                                  i < client.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div>
                        <p className="text-text-primary">{client.contact}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1 text-xs text-text-secondary">
                            <Mail className="h-3 w-3" />
                            {client.email}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-text-secondary">
                            <Phone className="h-3 w-3" />
                            {client.phone}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="flex items-center gap-1 text-text-secondary">
                        <MapPin className="h-3 w-3" />
                        {client.city}
                      </span>
                    </td>
                    <td className="table-cell">
                      {getStatusBadge(client.status)}
                    </td>
                    <td className="table-cell">
                      <span className="font-medium text-text-primary">{client.contracts}</span>
                    </td>
                    <td className="table-cell">
                      <span className="font-medium text-green-600">{client.revenue}</span>
                    </td>
                    <td className="table-cell">
                      <span className="flex items-center gap-1 text-text-secondary">
                        <Calendar className="h-3 w-3" />
                        {new Date(client.lastContact).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                    <td className="table-cell text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1 hover:bg-blue-50 rounded transition-colors">
                          <Eye className="h-4 w-4 text-blue-600" />
                        </button>
                        <button className="p-1 hover:bg-yellow-50 rounded transition-colors">
                          <Edit className="h-4 w-4 text-yellow-600" />
                        </button>
                        <button className="p-1 hover:bg-red-50 rounded transition-colors">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-50 rounded transition-colors">
                          <MoreVertical className="h-4 w-4 text-text-secondary" />
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
