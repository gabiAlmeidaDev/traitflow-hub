// src/components/layout/AppSidebar.tsx - SIDEBAR CORRIGIDO
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Layers, 
  BarChart3, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface AppSidebarProps {
  collapsed?: boolean;
}

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Candidatos',
    href: '/candidatos',
    icon: Users,
  },
  {
    title: 'Testes',
    href: '/testes',
    icon: FileText,
  },
  {
    title: 'Batches',
    href: '/batches',
    icon: Layers,
  },
  {
    title: 'Relatórios',
    href: '/relatorios',
    icon: BarChart3,
  },
  {
    title: 'Configurações',
    href: '/configuracoes',
    icon: Settings,
  },
];

export function AppSidebar({ collapsed = false }: AppSidebarProps) {
  const location = useLocation();
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 shadow-sm flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TA</span>
          </div>
          {!collapsed && (
            <span className="font-bold text-xl text-gray-800">
              TalentAlign
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200',
                    'hover:bg-blue-50 hover:text-blue-600',
                    isActive 
                      ? 'bg-blue-100 text-blue-600 font-medium' 
                      : 'text-gray-700',
                    collapsed && 'justify-center px-2'
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="truncate">{item.title}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        {!collapsed && (
          <div className="mb-3 px-3">
            <p className="text-sm font-medium text-gray-700 truncate">
              {user?.email?.split('@')[0]}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email}
            </p>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className={cn(
            'w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50',
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span className="ml-3">Sair</span>}
        </Button>
      </div>
    </div>
  );
}