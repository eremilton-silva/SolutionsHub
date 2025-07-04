import React from 'react';
import { 
  Search,
  Bell,
  Settings,
  ChevronDown
} from 'lucide-react';
import { Avatar } from '../ui';

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export const Header: React.FC<HeaderProps> = ({ 
  user = { name: 'João Silva', email: 'joao@email.com' }
}) => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Logo e título */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-secondary-800 font-bold text-sm">SH</span>
          </div>
          <h1 className="text-xl font-semibold text-text-primary">Solution <span className="text-primary-500">Hub</span></h1>
        </div>
      </div>

      {/* Barra de pesquisa central */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Pesquisar clientes, licitações..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm"
          />
        </div>
      </div>

      {/* Ações do usuário */}
      <div className="flex items-center gap-3">
        {/* Notificações */}
        <button className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Configurações */}
        <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>

        {/* Divisor */}
        <div className="w-px h-6 bg-gray-200"></div>

        {/* Perfil do usuário */}
        <div className="flex items-center gap-3">
          <Avatar name={user.name} size="sm" />
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-700">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </header>
  );
};
