import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Target,
  Bell,
  FileText,
  BarChart3,
  Kanban,
  DollarSign,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

const mainMenuItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: '/dashboard'
  },
  {
    id: 'crm',
    label: 'CRM - Cliente 360°',
    icon: <Users className="w-5 h-5" />,
    path: '/crm'
  },
  {
    id: 'market-intelligence',
    label: 'Inteligência de Mercado',
    icon: <TrendingUp className="w-5 h-5" />,
    path: '/market-intelligence',
    badge: 3
  },
  {
    id: 'opportunities',
    label: 'Gestão de Oportunidades',
    icon: <Target className="w-5 h-5" />,
    path: '/opportunities'
  },
  {
    id: 'notifications',
    label: 'Central de Alertas',
    icon: <Bell className="w-5 h-5" />,
    path: '/notifications',
    badge: 12
  },
  {
    id: 'documents',
    label: 'Gestão Documental',
    icon: <FileText className="w-5 h-5" />,
    path: '/documents'
  },
  {
    id: 'financial',
    label: 'Financeiro',
    icon: <DollarSign className="w-5 h-5" />,
    path: '/financial'
  },
  {
    id: 'analytics',
    label: 'Dashboard Analítico',
    icon: <BarChart3 className="w-5 h-5" />,
    path: '/analytics'
  },
  {
    id: 'productivity',
    label: 'Produtividade',
    icon: <Kanban className="w-5 h-5" />,
    path: '/productivity'
  }
];

const bottomMenuItems: SidebarItem[] = [
  {
    id: 'settings',
    label: 'Configurações',
    icon: <Settings className="w-5 h-5" />,
    path: '/settings'
  },
  {
    id: 'help',
    label: 'Ajuda',
    icon: <HelpCircle className="w-5 h-5" />,
    path: '/help'
  }
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const SidebarItemComponent: React.FC<{ item: SidebarItem }> = ({ item }) => (
    <NavLink
      to={item.path}
      className={`
        flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200
        ${isActiveRoute(item.path) 
          ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-500' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }
      `}
    >
      <div className="flex items-center gap-3">
        {item.icon}
        <span className="font-medium text-sm">{item.label}</span>
      </div>
      {item.badge && (
        <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center">
          {item.badge}
        </span>
      )}
    </NavLink>
  );

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Menu principal */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Menu Principal
          </h2>
          <div className="space-y-1">
            {mainMenuItems.map((item) => (
              <SidebarItemComponent key={item.id} item={item} />
            ))}
          </div>
        </div>
      </nav>

      {/* Menu inferior */}
      <div className="border-t border-gray-200 px-4 py-4 space-y-1">
        {bottomMenuItems.map((item) => (
          <SidebarItemComponent key={item.id} item={item} />
        ))}
        
        {/* Botão de logout */}
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors duration-200">
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Sair</span>
        </button>
      </div>
    </aside>
  );
};
