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
  Shield,
  LogOut,
  User as UserIcon
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const getNavigationItems = (isSuperAdmin: boolean) => {
  const baseItems = [
    { title: "Dashboard", url: "/", icon: BarChart3, description: "Visão geral e métricas" },
    { title: "Testes", url: "/testes", icon: ClipboardList, description: "Gerenciar testes de personalidade" },
    { title: "Candidatos", url: "/candidatos", icon: Users, description: "Base de candidatos" },
    { title: "Batches", url: "/batches", icon: Layers, description: "Grupos de testes" },
    { title: "Relatórios", url: "/relatorios", icon: FileText, description: "Analytics e resultados" },
    { title: "Configurações", url: "/configuracoes", icon: Settings, description: "Preferências do sistema" },
  ];
  if (isSuperAdmin) {
    baseItems.push({ title: "Admin", url: "/admin", icon: Shield, description: "Painel administrativo" });
  }
  return baseItems;
};

export function AppSidebar() {
  const { state } = useSidebar();
  const { profile, signOut, isSuperAdmin } = useAuth();
  const location = useLocation();
  const collapsed = state === "collapsed";
  const navigationItems = getNavigationItems(isSuperAdmin);

  const isActive = (path: string) => (path === "/" ? location.pathname === "/" : location.pathname.startsWith(path));

  return (
    <Sidebar
      className={cn(
        "border-r border-sidebar-border glass-effect transition-all duration-300 overflow-hidden",
        collapsed ? "w-16" : "w-64"
      )}
      collapsible="icon"
    >
      <SidebarContent className="flex flex-col h-full">
        {/* Logo */}
        <div className="px-4 py-6 flex items-center gap-3 border-b border-sidebar-border">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-glow rounded-xl flex items-center justify-center shadow">
            <PieChart className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-gradient">Traitview</h2>
              <p className="text-sm text-sidebar-foreground/60">Personality Analytics</p>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <SidebarGroup className="flex-1 overflow-auto px-4 py-6">
          <SidebarGroupLabel
            className={cn(
              "text-sidebar-foreground/60 text-xs uppercase tracking-wide mb-4",
              collapsed && "hidden"
            )}
          >
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink
                    to={item.url}
                    end={item.url === "/"}
                    className={({ isActive: navActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-200",
                        navActive ? "bg-sidebar-accent/20 text-sidebar-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/10",
                        collapsed && "justify-center"
                      )
                    }
                    title={collapsed ? item.title : undefined}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && (
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{item.title}</span>
                        <p className="text-xs text-sidebar-foreground/50">{item.description}</p>
                      </div>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User & Logout */}
        <div className="px-4 py-6 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-glow rounded-xl flex items-center justify-center shadow ring-2 ring-primary/20">
              <UserIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="flex-1">
                <p className="text-sm font-semibold text-sidebar-foreground">{profile?.nome_completo || 'Usuário'}</p>
                <p className="text-xs text-sidebar-foreground/60 capitalize">{profile?.papel.replace('_', ' ')}</p>
              </div>
            )}
            <button
              onClick={signOut}
              className={cn(
                "p-2 rounded-lg transition-colors duration-200",
                collapsed ? "mx-auto" : "hover:bg-sidebar-accent/10"
              )}
              title="Sair"
            >
              <LogOut className="w-5 h-5 text-sidebar-foreground/80 hover:text-sidebar-foreground" />
            </button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
