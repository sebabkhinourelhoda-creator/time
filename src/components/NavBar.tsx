import { BellIcon, MenuIcon, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

interface NavBarProps {
  onMenuClick?: () => void;
}

export function NavBar({ onMenuClick }: NavBarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isAdminPage = location.pathname.startsWith('/admin');
  
  return (
    <header className={`h-16 border-b border-border/40 flex items-center fixed top-0 z-40 bg-background/95 backdrop-blur-sm ${
      isAdminPage ? 'md:left-64 left-0 right-0' : 'left-0 lg:left-64 right-0'
    }`}>
      <div className="flex-1 flex items-center justify-between px-6 gap-4">
        {/* Mobile hamburger menu - hidden on admin pages */}
        {!isAdminPage && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <MenuIcon size={20} />
          </Button>
        )}

        <div className="flex items-center gap-4 ml-auto">
          {/* User Info Display */}
          {user && (
            <div className="text-sm text-muted-foreground hidden sm:block">
              Welcome, {user.full_name || user.username}
            </div>
          )}

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <BellIcon size={20} className="text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </Button>

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full border-2 border-primary/20 hover:border-primary/40">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar_url} alt={user?.full_name || user?.username} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {user?.full_name 
                      ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
                      : user?.username?.[0].toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.full_name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    @{user?.username}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => navigate('/profile')}>
                  Profile
                </DropdownMenuItem>
                {user?.role === 'admin' && (
                  <DropdownMenuItem onSelect={() => navigate('/admin')} className="text-red-600">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}