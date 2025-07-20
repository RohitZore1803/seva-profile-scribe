import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react";

export default function AdminAuth() {
  const navigate = useNavigate();
  const { user, loading } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user && !loading) {
      // Check if user is admin and redirect accordingly
      checkAdminStatus();
    }
  }, [user, loading]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", user.id)
        .maybeSingle();
      
      if (profile?.user_type === "pandit") {
        navigate("/dashboard-pandit");
      } else {
        navigate("/dashboard-customer");
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      navigate("/dashboard-customer");
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First try to authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (authError) {
        toast({
          title: "Login Failed",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }

      // For admin login, create admin profile if it doesn't exist
      if (authData.user && loginForm.email === "admin@eguruji.com") {
        // Check if admin profile exists
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authData.user.id)
          .maybeSingle();

        if (!existingProfile) {
          // Create admin profile
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: authData.user.id,
              name: "Admin",
              email: authData.user.email,
              user_type: "customer", // Since we don't have admin type in enum
            });

          if (profileError) {
            console.error("Error creating admin profile:", profileError);
          }
        }

        toast({
          title: "Welcome Admin!",
          description: "You have been successfully logged in.",
        });
        navigate("/dashboard-admin");
      } else {
        await supabase.auth.signOut();
        toast({
          title: "Access Denied",
          description: "Invalid admin credentials.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-red-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-red-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-3xl font-bold text-red-800 dark:text-red-400">
            Admin Portal
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
            Secure administrative access
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Admin Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="Enter admin email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Admin Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/auth")}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              ← Back to User Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
