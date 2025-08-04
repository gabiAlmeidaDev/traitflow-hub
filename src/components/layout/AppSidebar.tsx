import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Users,
  ClipboardList,
  Layers,
  FileText,
  Settings,
  PieChart,
  ChevronLeft,
  ChevronRight,
  Shield,
  LogOut,
  User
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const getNavigationItems = (isSuperAdmin: boolean) => {
  const baseItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: BarChart3,
      description: "Visão geral e métricas"
    },
    {
      title: "Testes",
      url: "/testes",
      icon: ClipboardList,
      description: "Gerenciar testes de personalidade"
    },
    {
      title: "Candidatos",
      url: "/candidatos",
      icon: Users,
      description: "Base de candidatos"
    },
    {
      title: "Batches",
      url: "/batches",
      icon: Layers,
      description: "Grupos de testes"
    },
    {
      title: "Relatórios",
      url: "/relatorios",
      icon: FileText,
      description: "Analytics e resultados"
    },
    {
      title: "Configurações",
      url: "/configuracoes",
      icon: Settings,
      description: "Preferências do sistema"
    },
  ];

  if (isSuperAdmin) {
    baseItems.push({
      title: "Admin",
      url: "/admin",
      icon: Shield,
      description: "Painel administrativo"
    });
  }

  return baseItems;
};

export function AppSidebar() {
  const { state } = useSidebar();
  const { profile, signOut, isSuperAdmin } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  
  const navigationItems = getNavigationItems(isSuperAdmin);

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar
      className={cn(
        "border-r border-sidebar-border glass-effect transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
      collapsible="icon"
    >
      <SidebarContent className="p-0">
        {/* Logo/Brand Section */}
        <div className="px-6 py-8 border-b border-sidebar-border">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-primary to-primary-glow rounded-2xl flex items-center justify-center shadow-lg">
              <PieChart className="w-6 h-6 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="animate-in slide-in-from-left-2 duration-200">
                <h2 className="text-2xl font-bold text-gradient">
                  Traitview
                </h2>
                <p className="text-sm text-sidebar-foreground/60">
                  Personality Analytics
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup className="px-4 py-8">
          <SidebarGroupLabel className={cn(
            "text-sidebar-foreground/60 text-sm uppercase tracking-wider mb-6 font-semibold",
            collapsed && "hidden"
          )}>
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={cn(
                        "sidebar-nav-item w-full",
                        isActive(item.url) && "active"
                      )}
                      title={collapsed ? item.title : ""}
                    >
                      <item.icon className="w-6 h-6 flex-shrink-0" />
                      {!collapsed && (
                        <div className="animate-in slide-in-from-left-2 duration-200">
                          <span className="font-semibold text-base">{item.title}</span>
                          <p className="text-sm text-current/60 hidden sm:block">
                            {item.description}
                          </p>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom section */}
        <div className="mt-auto p-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-glow rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-primary/20">
                <User className="w-6 h-6 text-primary-foreground" />
              </div>
              {!collapsed && (
                <div className="animate-in slide-in-from-left-2 duration-200">
                  <p className="text-base font-semibold text-sidebar-foreground">
                    {profile?.nome_completo || 'Usuário'}
                  </p>
                  <p className="text-sm text-sidebar-foreground/60">
                    {profile?.papel === 'super_admin' ? 'Super Admin' : 
                     profile?.papel === 'admin_empresa' ? 'Admin' : 'Usuário'}
                  </p>
                </div>
              )}
            </div>
            {!collapsed && (
              <button
                onClick={signOut}
                className="p-2 hover:bg-sidebar-accent/50 rounded-xl transition-colors duration-300"
                title="Sair"
              >
                <LogOut className="w-5 h-5 text-sidebar-foreground/60 hover:text-sidebar-foreground" />
              </button>
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}