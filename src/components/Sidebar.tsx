import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FileTextIcon,
  LayoutDashboardIcon,
  BookOpenIcon,
  HeartPulseIcon,
  Users2Icon,
  BrainCircuitIcon,
  Settings2Icon
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";

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

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="h-screen w-64 bg-card border-r border-border/40 flex flex-col fixed left-0 top-0">
      {/* Logo Section */}
      <div className="h-16 border-b border-border/40 flex items-center px-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center relative">
            <span className="text-background font-bold text-sm">T2T</span>
          </div>
        </div>
        <span className="ml-3 font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Time2Thrive
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-4 space-y-2">
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

      {/* Bottom Section */}
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
  );
}