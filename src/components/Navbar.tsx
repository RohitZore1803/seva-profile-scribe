
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Star, BookOpen, Users, Calendar, Sparkles } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const navigationItems = [
    { name: "Services", href: "/services", icon: BookOpen },
    { name: "Astrology", href: "/astrology", icon: Star },
    { name: "Live Streams", href: "/live-streams", icon: Calendar },
    { name: "About", href: "/about", icon: Users },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Pooja Path
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors duration-200 font-medium"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/dashboard">
                  <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="text-gray-600 hover:text-orange-600"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth">
                  <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                    Login
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md border-t border-orange-100">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
              
              <div className="pt-4 space-y-2">
                {user ? (
                  <>
                    <Link to="/dashboard">
                      <Button
                        variant="outline"
                        className="w-full justify-start border-orange-200 text-orange-700 hover:bg-orange-50"
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      variant="ghost"
                      className="w-full justify-start text-gray-600 hover:text-orange-600"
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth">
                      <Button
                        variant="outline"
                        className="w-full justify-start border-orange-200 text-orange-700 hover:bg-orange-50"
                        onClick={() => setIsOpen(false)}
                      >
                        Login
                      </Button>
                    </Link>
                    <Link to="/auth">
                      <Button
                        className="w-full justify-start bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
                        onClick={() => setIsOpen(false)}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
