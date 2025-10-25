import { useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users2Icon } from 'lucide-react';

export default function DashboardCollaborations() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />
      <div className="flex-1 lg:pl-64 min-h-screen bg-background">
        <NavBar onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <div className="w-full py-4 px-4 lg:py-8 lg:px-6 space-y-6 lg:space-y-8 mt-16 min-h-screen bg-background">
          <div className="space-y-1">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Collaborations
            </h1>
            <p className="text-sm lg:text-base text-muted-foreground">
              Manage your research collaborations and partnerships
            </p>
          </div>

          <Card className="border-2 bg-background/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users2Icon size={20} />
                Coming Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Collaboration management functionality will be available soon. 
                You'll be able to connect with researchers, manage joint projects, and share resources.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}