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
  FolderOpen,
  Menu,
  X
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

interface AdminStats {
  totalUsers: number;
  totalVideos: number;
  totalDocuments: number;
  totalComments: number;
  totalCategories: number;
  pendingVideos: number;
  pendingDocuments: number;
}

interface SidebarItemProps {
  label: string;
  icon: any;
  href?: string;
  count?: number;
  children?: SidebarItemProps[];
  isActive?: boolean;
  onClick?: () => void;
  onMobileClose?: () => void;
}

function SidebarItem({ label, icon: Icon, href, count, children, isActive, onClick, onMobileClose }: SidebarItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  
  const isCurrentActive = href ? location.pathname === href : isActive;
  const hasActiveChild = children?.some(child => child.href && location.pathname === child.href);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (children) {
      setIsExpanded(!isExpanded);
    }
    // Close mobile menu when clicking on a link
    if (href && onMobileClose) {
      onMobileClose();
    }
  };

  const ItemContent = (
    <Button
      variant={isCurrentActive || hasActiveChild ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start gap-3 h-10 px-3",
        (isCurrentActive || hasActiveChild) && "bg-red-50 text-red-700 hover:bg-red-100"
      )}
      onClick={handleClick}
    >
      <Icon size={18} className={cn("text-muted-foreground", (isCurrentActive || hasActiveChild) && "text-red-600")} />
      <span className={cn("text-sm truncate text-left flex-1", (isCurrentActive || hasActiveChild) && "text-red-700")}>
        {label}
      </span>
      {count !== undefined && (
        <Badge variant="secondary" className="ml-2">
          {count}
        </Badge>
      )}
      {children && (
        <div className="ml-auto">
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
      )}
    </Button>
  );

  return (
    <div>
      {href ? (
        <Link to={href}>
          {ItemContent}
        </Link>
      ) : (
        ItemContent
      )}
      
      {children && isExpanded && (
        <div className="ml-6 mt-1 space-y-1">
          {children.map((child, index) => (
            <SidebarItem 
              key={index} 
              {...child} 
              onMobileClose={onMobileClose}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminSidebar() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Get total videos
      const { count: totalVideos } = await supabase
        .from('videos')
        .select('*', { count: 'exact', head: true });

      // Get total documents
      const { count: totalDocuments } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true });

      // Get total comments
      const { count: totalComments } = await supabase
        .from('video_comments')
        .select('*', { count: 'exact', head: true });

      // Get total categories
      const { count: totalCategories } = await supabase
        .from('document_categories')
        .select('*', { count: 'exact', head: true });

      // Get pending videos
      const { count: pendingVideos } = await supabase
        .from('videos')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get pending documents
      const { count: pendingDocuments } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      setStats({
        totalUsers: totalUsers || 0,
        totalVideos: totalVideos || 0,
        totalDocuments: totalDocuments || 0,
        totalComments: totalComments || 0,
        totalCategories: totalCategories || 0,
        pendingVideos: pendingVideos || 0,
        pendingDocuments: pendingDocuments || 0
      });
    } catch (error) {
      console.error('Failed to load admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const sidebarItems: SidebarItemProps[] = [
    {
      label: "Overview",
      icon: BarChart3,
      href: "/admin"
    },
    {
      label: "Users",
      icon: Users,
      count: stats?.totalUsers,
      children: [
        {
          label: "All Users",
          icon: Users,
          href: "/admin/users"
        },
        {
          label: "User Comments",
          icon: MessageCircle,
          href: "/admin/users/comments"
        }
      ]
    },
    {
      label: "Videos",
      icon: Video,
      count: stats?.totalVideos,
      children: [
        {
          label: "All Videos",
          icon: Video,
          href: "/admin/videos"
        },
        {
          label: "Video Comments",
          icon: MessageCircle,
          href: "/admin/videos/comments",
          count: stats?.totalComments
        },
        {
          label: "Pending Videos",
          icon: Video,
          href: "/admin/videos/pending",
          count: stats?.pendingVideos
        }
      ]
    },
    {
      label: "Documents",
      icon: FileText,
      count: stats?.totalDocuments,
      children: [
        {
          label: "All Documents",
          icon: FileText,
          href: "/admin/documents"
        },
        {
          label: "Document Comments",
          icon: MessageCircle,
          href: "/admin/documents/comments"
        },
        {
          label: "Pending Documents",
          icon: FileText,
          href: "/admin/documents/pending",
          count: stats?.pendingDocuments
        }
      ]
    },
    {
      label: "Categories",
      icon: FolderOpen,
      count: stats?.totalCategories,
      href: "/admin/categories"
    },
    {
      label: "Comments",
      icon: MessageCircle,
      count: stats?.totalComments,
      children: [
        {
          label: "All Comments",
          icon: MessageCircle,
          href: "/admin/comments"
        },
        {
          label: "Video Comments",
          icon: Video,
          href: "/admin/comments/videos"
        },
        {
          label: "Document Comments",
          icon: FileText,
          href: "/admin/comments/documents"
        }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-[60] bg-background border shadow-sm"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "h-screen w-64 bg-background border-r border-border/40 flex flex-col fixed left-0 top-0 pt-0 z-50 transition-transform duration-300 shadow-lg",
        "md:translate-x-0", // Always visible on desktop
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full" // Toggle on mobile
      )}>
        {/* T2T Header */}
        <div className="px-4 py-4 border-b border-border/40">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T2T</span>
            </div>
            <div>
              <h2 className="font-bold text-lg bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Time2Thrive
              </h2>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>
        </div>

      {/* Admin User Profile */}
      <div className="px-4 py-4 border-b border-border/40">
        <div className="flex items-center gap-3 mb-3">
          <Avatar>
            {user?.avatar_url ? (
              <AvatarImage src={user.avatar_url} alt={user.full_name || user.username || 'Admin'} />
            ) : (
              <AvatarFallback className="bg-red-100 text-red-600">
                {(user?.full_name || user?.username || 'A').slice(0, 2)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate flex items-center gap-2">
              {user?.full_name || user?.username || 'Admin'}
              <Shield size={14} className="text-red-600" />
            </div>
            <div className="text-xs text-muted-foreground truncate">{user?.email ?? ''}</div>
          </div>
        </div>
        <Badge variant="destructive" className="w-full justify-center">
          Administrator
        </Badge>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {sidebarItems.map((item, index) => (
          <SidebarItem 
            key={index} 
            {...item} 
            onMobileClose={() => setIsMobileMenuOpen(false)}
          />
        ))}
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border/40 space-y-2">
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
          <Settings size={16} />
          Admin Settings
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
    </>
  );
}