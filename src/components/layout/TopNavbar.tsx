// src/components/layout/TopNavbar.tsx - NAVBAR SUPERIOR
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bell, Settings, LogOut, User } from 'lucide-react';

export function TopNavbar() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const userInitials = user?.email
    ?.split('@')[0]
    ?.split('.')
    ?.map(name => name[0])
    ?.join('')
    ?.toUpperCase() || 'U';

  return (
    <div className="flex items-center gap-4">
      {/* Notifications */}
      <Button variant="ghost" size="sm" className="relative">
        <Bell className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
      </Button>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 px-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-sm bg-blue-100 text-blue-600">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:block text-sm font-medium">
              {user?.email?.split('@')[0]}
            </span>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div>
              <p className="font-medium">{user?.email?.split('@')[0]}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Perfil
          </DropdownMenuItem>
          
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleLogout}
            className="text-red-600 focus:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}