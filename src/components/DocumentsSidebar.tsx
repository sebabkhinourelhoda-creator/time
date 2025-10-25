import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FileTextIcon,
  BookOpenIcon,
  HeartPulseIcon,
  Users2Icon,
  BrainCircuitIcon,
  Settings2Icon,
  LayoutDashboardIcon,
  X
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";

interface DocumentsSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const sidebarLinks = [
  {
    label: "Dashboard",
    icon: LayoutDashboardIcon,
    href: "/dashboard"
  },
  {
    label: "My Documents",
    icon: FileTextIcon,
    href: "/dashboard/documents"
  },
  {
    label: "Research Papers",
    icon: BookOpenIcon,
    href: "/dashboard/research"
  },
  {
    label: "Health Studies",
    icon: HeartPulseIcon,
    href: "/dashboard/studies"
  },
  {
    label: "Collaborations",
    icon: Users2Icon,
    href: "/dashboard/collaborations"
  },
  {
    label: "AI Analysis",
    icon: BrainCircuitIcon,
    href: "/dashboard/ai-analysis"
  },
  {
    label: "Settings",
    icon: Settings2Icon,
    href: "/dashboard/settings"
  }
];

export function DocumentsSidebar({ isOpen = false, onClose }: DocumentsSidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <div className={cn(
        "h-screen w-64 bg-card border-r border-border/40 flex flex-col fixed left-0 top-0 z-40 transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border/40 bg-card">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T2T</span>
            </div>
            <span className="text-lg font-semibold text-foreground">Time2Thrive</span>
          </div>
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden"
          >
            <X size={20} />
          </Button>
        </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-4 space-y-2 bg-card">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.href;

          return (
            <Link to={link.href} key={link.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
              >
                <Icon size={18} className={cn("text-muted-foreground", isActive && "text-primary")} />
                <span className={cn("text-muted-foreground", isActive && "text-primary")}>
                  {link.label}
                </span>
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Bottom Help Section */}
      <div className="p-4 border-t border-border/40">
        <div className="p-4 rounded-lg bg-primary/5 space-y-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <HeartPulseIcon size={18} className="text-primary" />
          </div>
          <h4 className="font-medium text-sm">Need Help?</h4>
          <p className="text-xs text-muted-foreground">
            Contact our support team for assistance with any issues.
          </p>
          <Button variant="secondary" size="sm" className="w-full">
            Contact Support
          </Button>
        </div>
      </div>
      </div>
      </>
    );
}