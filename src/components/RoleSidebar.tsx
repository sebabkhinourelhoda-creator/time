import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  FileText,
  Video,
  MessageCircle,
  BarChart3,
  Settings,
  Shield,
  Home,
  LogOut,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Upload,
  Eye,
  User
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

interface SidebarItemProps {
  label: string;
  icon: any;
  href?: string;
  count?: number;
  children?: SidebarItemProps[];
  isActive?: boolean;
  onClick?: () => void;
}

function SidebarItem({ label, icon: Icon, href, count, children, isActive, onClick }: SidebarItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  
  const isCurrentActive = href ? location.pathname === href : isActive;
  const hasActiveChild = children?.some(child => child.href && location.pathname === child.href);
  
  const isAdmin = user?.role === 'admin';

  const handleClick = () => {
    if (children) {
      setIsExpanded(!isExpanded);
    }
    if (onClick) {
      onClick();
    }
  };

  const ItemContent = (
    <Button
      variant={isCurrentActive || hasActiveChild ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start gap-3 h-10 px-3",
        (isCurrentActive || hasActiveChild) && (
          isAdmin 
            ? "bg-red-50 text-red-700 hover:bg-red-100" 
            : "bg-blue-50 text-blue-700 hover:bg-blue-100"
        )
      )}
      onClick={handleClick}
    >
      <Icon size={18} className={cn(
        "text-muted-foreground", 
        (isCurrentActive || hasActiveChild) && (
          isAdmin ? "text-red-600" : "text-blue-600"
        )
      )} />
      <span className={cn(
        "text-sm truncate text-left flex-1", 
        (isCurrentActive || hasActiveChild) && (
          isAdmin ? "text-red-700" : "text-blue-700"
        )
      )}>
        {label}
      </span>
      {count !== undefined && (
        <Badge variant="secondary" className="ml-auto">
          {count}
        </Badge>
      )}
      {children && (
        <ChevronRight 
          size={16} 
          className={cn(
            "ml-auto transition-transform text-muted-foreground",
            isExpanded && "rotate-90"
          )}
        />
      )}
    </Button>
  );

  if (href && !children) {
    return (
      <Link to={href}>
        {ItemContent}
      </Link>
    );
  }

  return (
    <div>
      {ItemContent}
      {children && isExpanded && (
        <div className="ml-6 mt-1 space-y-1">
          {children.map((child, index) => (
            <SidebarItem key={index} {...child} />
          ))}
        </div>
      )}
    </div>
  );
}

export function RoleSidebar() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<{
    totalUsers?: number;
    totalVideos?: number;
    totalDocuments?: number;
    totalComments?: number;
    userVideos?: number;
    userDocuments?: number;
  }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, [user]);

  const loadStats = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      if (user.role === 'admin') {
        // Load admin stats
        const [
          { count: totalUsers },
          { count: totalVideos },
          { count: totalDocuments },
          { count: totalComments }
        ] = await Promise.all([
          supabase.from('users').select('*', { count: 'exact', head: true }),
          supabase.from('videos').select('*', { count: 'exact', head: true }),
          supabase.from('documents').select('*', { count: 'exact', head: true }),
          supabase.from('video_comments').select('*', { count: 'exact', head: true })
        ]);
        
        setStats({
          totalUsers: totalUsers || 0,
          totalVideos: totalVideos || 0,
          totalDocuments: totalDocuments || 0,
          totalComments: totalComments || 0
        });
      } else {
        // Load user stats (their own content)
        const [
          { count: userVideos },
          { count: userDocuments }
        ] = await Promise.all([
          supabase.from('videos').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
          supabase.from('documents').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
        ]);
        
        setStats({
          userVideos: userVideos || 0,
          userDocuments: userDocuments || 0
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Admin sidebar items
  const adminSidebarItems = [
    {
      label: "Overview",
      icon: BarChart3,
      href: "/admin"
    },
    {
      label: "Users",
      icon: Users,
      count: stats.totalUsers,
      href: "/admin/users"
    },
    {
      label: "Videos",
      icon: Video,
      count: stats.totalVideos,
      href: "/admin/videos"
    },
    {
      label: "Documents",
      icon: FileText,
      count: stats.totalDocuments,
      href: "/admin/documents"
    },
    {
      label: "Comments",
      icon: MessageCircle,
      count: stats.totalComments,
      href: "/admin/comments"
    }
  ];

  // User sidebar items  
  const userSidebarItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard"
    },
    {
      label: "My Documents",
      icon: FileText,
      count: stats.userDocuments,
      href: "/dashboard/documents"
    },
    {
      label: "My Videos",
      icon: Video,
      count: stats.userVideos,
      href: "/dashboard/videos"
    }
  ];

  const sidebarItems = user?.role === 'admin' ? adminSidebarItems : userSidebarItems;

  return (
    <div className="h-[calc(100vh-4rem)] w-64 bg-card border-r border-border/40 flex flex-col fixed left-0 top-16 pt-0 z-40">
      {/* User Profile Section */}
      <div className="px-4 py-4 border-b border-border/40">
        <div className="flex items-center gap-3 mb-3">
          <Avatar>
            {user?.avatar_url ? (
              <AvatarImage src={user.avatar_url} alt={user.full_name || user.username || 'User'} />
            ) : (
              <AvatarFallback className={user?.role === 'admin' ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}>
                {(user?.full_name || user?.username || 'U').slice(0, 2)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate flex items-center gap-2">
              {user?.full_name || user?.username || 'User'}
              {user?.role === 'admin' && <Shield size={14} className="text-red-600" />}
            </div>
            <div className="text-xs text-muted-foreground truncate">{user?.email ?? ''}</div>
          </div>
        </div>
        <Badge 
          variant={user?.role === 'admin' ? "destructive" : "secondary"} 
          className="w-full justify-center"
        >
          {user?.role === 'admin' ? 'Administrator' : 'User'}
        </Badge>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {/* Profile link */}
        <SidebarItem
          label="Profile"
          icon={User}
          href="/profile"
        />
        <Separator className="my-2" />
        
        {sidebarItems.map((item, index) => (
          <SidebarItem key={index} {...item} />
        ))}
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border/40 space-y-2">
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
          <Settings size={16} />
          Settings
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </div>
  );
}