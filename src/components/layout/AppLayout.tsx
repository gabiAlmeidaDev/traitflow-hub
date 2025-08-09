// src/components/layout/AppLayout.tsx - LAYOUT CORRIGIDO
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { TopNavbar } from './TopNavbar';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  console.log('🏗️ AppLayout renderizado');

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'w-64' : 'w-16'
      } transition-all duration-300 ease-in-out flex-shrink-0`}>
        <AppSidebar collapsed={!sidebarOpen} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <h2 className="text-xl font-semibold text-gray-800">
                TalentAlign
              </h2>
            </div>
            
            <TopNavbar />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}