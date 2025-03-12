
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Users, Bell, Menu, Search, X } from "lucide-react";

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  
  // This would come from auth context in a real app
  const isLoggedIn = false;
  
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold">Connect</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {showSearch ? (
            <div className="relative">
              <Input 
                type="search" 
                placeholder="Search..." 
                className="w-64 pr-8"
                autoFocus
              />
              <Button
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0"
                onClick={() => setShowSearch(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowSearch(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          <Button variant="ghost" asChild>
            <Link to="/chat">
              <MessageCircle className="mr-2 h-5 w-5" />
              Chat
            </Link>
          </Button>
          
          <Button variant="ghost" asChild>
            <Link to="/communities">
              <Users className="mr-2 h-5 w-5" />
              Communities
            </Link>
          </Button>
          
          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
        
        {/* Mobile Menu Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t p-4">
          <div className="flex flex-col space-y-3">
            <div className="relative mb-2">
              <Input 
                type="search" 
                placeholder="Search..." 
                className="w-full pr-8"
              />
              <Button
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            <Button variant="ghost" className="justify-start" asChild>
              <Link to="/chat">
                <MessageCircle className="mr-2 h-5 w-5" />
                Chat
              </Link>
            </Button>
            
            <Button variant="ghost" className="justify-start" asChild>
              <Link to="/communities">
                <Users className="mr-2 h-5 w-5" />
                Communities
              </Link>
            </Button>
            
            {isLoggedIn ? (
              <>
                <Button variant="ghost" className="justify-start">
                  <Bell className="mr-2 h-5 w-5" />
                  Notifications
                </Button>
                <Button variant="ghost" className="justify-start">
                  Profile
                </Button>
                <Button variant="ghost" className="justify-start">
                  Settings
                </Button>
                <Button variant="ghost" className="justify-start">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button className="justify-start" asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
