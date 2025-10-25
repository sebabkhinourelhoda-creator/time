import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  FileTextIcon,
  LayoutDashboardIcon,
  BookOpenIcon,
  HeartPulseIcon,
  Users2Icon,
  BrainCircuitIcon,
  Settings2Icon,
  VideoIcon
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchSidebarCounts, SidebarCounts } from "@/lib/sidebarData";

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const [counts, setCounts] = useState<SidebarCounts | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const data = await fetchSidebarCounts(Number(user.id));
        if (!mounted) return;
        setCounts(data);
      } catch (err) {
        console.error('Failed to load sidebar counts', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [user]);

  const sidebarLinks = [
    {
      label: "Dashboard",
      icon: LayoutDashboardIcon,
      href: "/dashboard"
    },
    {
      label: "My Documents",
      icon: FileTextIcon,
      href: "/dashboard/documents",
      count: counts?.myDocuments
    },
    {
      label: "My Videos",
      icon: VideoIcon,
      href: "/dashboard/videos",
      count: counts?.myVideos
    },
    {
      label: "Research Papers",
      icon: BookOpenIcon,
      href: "/dashboard/research",
      count: counts?.totalDocuments
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

  return (
    <div className="h-[calc(100vh-4rem)] w-64 bg-card border-r border-border/40 flex flex-col fixed left-0 top-16 pt-0">
      {/* User / Profile Section */}
      <div className="px-4 py-4 border-b border-border/40 flex items-center gap-3">
        <Avatar>
          {user?.avatar_url ? (
            <AvatarImage src={user.avatar_url} alt={user.full_name || user.username || 'User'} />
          ) : (
            <AvatarFallback>{(user?.full_name || user?.username || 'U').slice(0, 2)}</AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{user?.full_name || user?.username || 'Guest'}</div>
          <div className="text-xs text-muted-foreground truncate">{user?.email ?? ''}</div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-2 space-y-1">
        {sidebarLinks.map((link) => {
          const Icon = link.icon as any;
          const isActive = location.pathname === link.href;

          return (
            <Link to={link.href} key={link.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10 px-3",
                  isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
              >
                <Icon size={18} className={cn("text-muted-foreground", isActive && "text-primary")} />
                <span className={cn("text-sm truncate text-left flex-1", isActive && "text-primary")}>
                  {link.label}
                </span>
                {/* show count if available */}
                {link.count !== undefined && (
                  <Badge className="ml-2">{loading ? '...' : link.count}</Badge>
                )}
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