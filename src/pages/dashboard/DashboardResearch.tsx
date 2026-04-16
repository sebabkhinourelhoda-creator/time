import { useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenIcon } from 'lucide-react';

export default function DashboardResearch() {
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
              Research Papers
            </h1>
            <p className="text-sm lg:text-base text-muted-foreground">
              Access and manage research papers and scientific publications
            </p>
          </div>

          <Card className="border-2 bg-background/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpenIcon size={20} />
                Coming Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Research papers management functionality will be available soon. 
                You'll be able to access scientific publications, manage citations, and collaborate with researchers.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}