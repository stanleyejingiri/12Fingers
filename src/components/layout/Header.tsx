// src/components/layout/Header.tsx
import { useState, useEffect } from "react";
import { Bell } from "lucide-react"; // add Bell icon
import { UserCircle, Settings, Menu, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { InboxDialog } from "@/components/messaging/InboxDialog";

interface HeaderProps {
  onShowAuthModal: () => void;
  onShowProfileModal: () => void;
  onToggleMobileFilters: () => void;
  isMobileFiltersOpen: boolean;
}

export const Header = ({ 
  onShowAuthModal, 
  onShowProfileModal,
  onToggleMobileFilters,
  isMobileFiltersOpen
}: HeaderProps) => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [showInbox, setShowInbox] = useState(false);
  
  // 🔴 ADD THESE NEW LINES
  const [unreadCount, setUnreadCount] = useState(0);

  /*const fetchUnreadCount = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`http://localhost:3001/api/notifications/unread/${user.id}`);
      const data = await response.json();
      if (data.success) {
        setUnreadCount(data.count);
      }
	  // Set app icon badge (if installed as PWA)
		if ('setAppBadge' in navigator && unreadCount > 0) {
		  navigator.setAppBadge(unreadCount);
		} else if ('clearAppBadge' in navigator && unreadCount === 0) {
		  navigator.clearAppBadge();
		}
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };*/
	const fetchUnreadCount = async () => {
	  if (!user?.id) return;
	  try {
		const response = await fetch(`http://localhost:3001/api/notifications/unread/${user.id}`);
		const data = await response.json();
		if (data.success) {
		  const newCount = data.count;
		  setUnreadCount(newCount);
		  
		  // 🔴 Set app icon badge after state is updated
		  if ('setAppBadge' in navigator && newCount > 0) {
			navigator.setAppBadge(newCount);
		  } else if ('clearAppBadge' in navigator && newCount === 0) {
			navigator.clearAppBadge();
		  }
		}
	  } catch (error) {
		console.error("Failed to fetch unread count:", error);
	  }
	};

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);
  // Rest of your existing code...



  const handleSignOut = async () => {
    try {
      console.log('🚪 Header: Sign out clicked');
      logout();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error: any) {
      console.error('❌ Header: Sign out error:', error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "An unexpected error occurred while signing out.",
      });
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: App Name & Tagline */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">12 Fingers</h1>
              <p className="mt-1 text-xs md:text-sm text-gray-600 hidden md:block">
                Find skilled workers in your area
              </p>
            </div>

            {/* Center: Mobile-only tagline */}
            <div className="flex-1 text-center md:hidden">
              <p className="text-xs text-gray-600">
                Find skilled workers
              </p>
            </div>

            {/* Right: Auth + Mobile Menu */}
            <div className="flex items-center gap-2">
              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center gap-3">
                {user ? (
                  <>
                    <span className="text-sm text-gray-600 hidden lg:inline">
                      Welcome, {user.name || user.email?.split('@')[0]}
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/dashboard">Dashboard</Link>
                    </Button>
                    
					{/* 🔴 NEW: bell for messages and notifications button */}
                   	<Button
					  variant="ghost"
					  size="icon"
					  onClick={() => setShowInbox(true)}
					  className="relative"
					>
					  <Bell className="h-5 w-5" />
					  {unreadCount > 0 && (
						<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
						  {unreadCount > 9 ? '9+' : unreadCount}
						</span>
					  )}
					</Button>
					
					<Button 
                      variant="outline"
                      size="icon"
                      onClick={onShowProfileModal}
                      className="h-8 w-8"
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={onShowAuthModal}
                      className="flex items-center gap-1"
                    >
                      <UserCircle className="w-4 h-4" />
                      Sign In
                    </Button>
                    <Button 
                      size="sm"
                      onClick={onShowAuthModal}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>

              {/* Mobile Auth Buttons */}
              <div className="flex md:hidden items-center gap-2">
                {user ? (
                  <>
                    <Button 
                      variant="ghost"
                      size="sm"
                      asChild
                      className="text-xs"
                    >
                      <Link to="/dashboard">Dashboard</Link>
                    </Button>
                    
					{/* 🔴 NEW: Messages button for mobile */}
                    <Button 
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowInbox(true)}
                      className="text-xs"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
					
					
                    <Button 
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="text-xs"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={onShowAuthModal}
                    className="text-xs flex items-center gap-1"
                  >
                    <UserCircle className="w-4 h-4" />
                    Sign In
                  </Button>
                )}
              </div>

              {/* Mobile Hamburger Menu */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleMobileFilters}
                className="md:hidden h-9 w-9"
              >
                {isMobileFiltersOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 🔴 Inbox Dialog */}
    <InboxDialog
	  isOpen={showInbox}
	  onClose={() => {
		setShowInbox(false);
		fetchUnreadCount();
	  }}
	  workerId={user?.id}
	  workerUserId={user?.id}
	  workerName={user?.name}
	/>
    </>
  );
};