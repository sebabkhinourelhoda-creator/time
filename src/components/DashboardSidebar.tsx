import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import {
  FileTextIcon,
  VideoIcon,
  LayoutDashboardIcon,
  X
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";

interface DashboardSidebarProps {
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
    label: "My Videos",
    icon: VideoIcon,
    href: "/dashboard/videos"
  }
];

export function DashboardSidebar({ isOpen = true, onClose }: DashboardSidebarProps) {
  const location = useLocation();

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[45] lg:hidden cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close sidebar"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onClose();
            }
          }}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full w-64 bg-background border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T2T</span>
            </div>
            <div>
              <h2 className="font-bold text-lg bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                Time2Thrive
              </h2>
              <p className="text-xs text-muted-foreground">Health Dashboard</p>
            </div>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden"
            >
              <X size={20} />
            </Button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-6 px-4 space-y-2">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;

            return (
              <Link to={link.href} key={link.href} onClick={onClose}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-12 text-left",
                    isActive && "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  )}
                >
                  <Icon size={20} className={cn("text-muted-foreground", isActive && "text-blue-600")} />
                  <span className={cn("text-muted-foreground font-medium", isActive && "text-blue-700")}>
                    {link.label}
                  </span>
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-border">
          <div className="p-4 rounded-lg bg-primary/5 space-y-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <FileTextIcon size={18} className="text-primary" />
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