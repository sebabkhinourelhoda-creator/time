import { ReactNode } from 'react';
import { NavBar } from './NavBar';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 pl-64">
          <div className="container py-6 px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}