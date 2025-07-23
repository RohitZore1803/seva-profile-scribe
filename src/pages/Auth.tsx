
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { cleanupAuthState } from "@/utils/authCleanup";
import { Eye, EyeOff, Mail, Lock, User, MapPin, Award, FileText, Phone } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const defaultRole = searchParams.get("role") || "customer";
  const [selectedRole, setSelectedRole] = useState<"customer" | "pandit">(
    defaultRole as "customer" | "pandit"
  );

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    expertise: "",
    aadhar_number: "",
  });

  useEffect(() => {
    if (user && !loading) {
      const fetchProfile = async () => {
        try {
          const { data } = await supabase
            .from("profiles")
            .select("user_type")
            .eq("id", user.id)
            .maybeSingle();
            
          if (data?.user_type === "pandit") {
            navigate("/dashboard-pandit");
          } else {
            navigate("/dashboard-customer");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          navigate("/dashboard-customer");
        }
      };
      
      fetchProfile();
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Clean auth state before login
      cleanupAuthState();
      
      const { error } = await supabase.auth.signInWithPassword({
        email: loginForm.email.trim(),
        password: loginForm.password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Clean auth state before signup
      cleanupAuthState();

      // Validate required fields
      if (!signupForm.name.trim() || !signupForm.email.trim() || !signupForm.password) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(signupForm.email.trim())) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        return;
      }

      // Validate password length
      if (signupForm.password.length < 6) {
        toast({
          title: "Password Too Short",
          description: "Password must be at least 6 characters long.",
          variant: "destructive",
        });
        return;
      }

      // For pandits, validate required fields
      if (selectedRole === "pandit") {
        if (!signupForm.expertise.trim()) {
          toast({
            title: "Expertise Required",
            description: "Please enter your expertise area.",
            variant: "destructive",
          });
          return;
        }
        if (!signupForm.aadhar_number.trim()) {
          toast({
            title: "Aadhar Number Required",
            description: "Please enter your Aadhar number.",
            variant: "destructive",
          });
          return;
        }
      }

      const redirectUrl = `${window.location.origin}/`;
      
      // Prepare metadata matching the database schema
      const metadata = {
        name: signupForm.name.trim(),
        user_type: selectedRole,
        phone: signupForm.phone.trim() || null,
        address: signupForm.address.trim() || null,
        expertise: selectedRole === "pandit" ? (signupForm.expertise.trim() || null) : null,
        aadhar_number: selectedRole === "pandit" ? (signupForm.aadhar_number.trim() || null) : null,
        is_verified: false,
      };

      console.log("Signing up with metadata:", metadata);

      const { data, error } = await supabase.auth.signUp({
        email: signupForm.email.trim(),
        password: signupForm.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: metadata,
        },
      });

      if (error) {
        console.error("Signup error:", error);
        
        if (error.message.includes("already registered")) {
          toast({
            title: "Account Exists",
            description: "This email is already registered. Please try logging in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Signup Failed",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      if (data.user) {
        console.log("User created successfully:", data.user.id);
        
        // Give the trigger a moment to run
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verify profile was created
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Profile verification error:", profileError);
          toast({
            title: "Profile Creation Issue",
            description: "Account created but profile verification failed. Please try logging in.",
            variant: "destructive",
          });
          return;
        }

        if (!profileData) {
          console.error("Profile not found after creation");
          toast({
            title: "Profile Not Found",
            description: "Account created but profile not found. Please contact support.",
            variant: "destructive",
          });
          return;
        }

        console.log("Profile verified:", profileData);

        toast({
          title: "Account Created Successfully!",
          description: data.user.email_confirmed_at 
            ? "Your account has been created and you are now logged in."
            : "Account created! Please check your email to verify your account.",
        });

        // Redirect based on user type
        if (data.user.email_confirmed_at) {
          if (selectedRole === "pandit") {
            navigate("/dashboard-pandit");
          } else {
            navigate("/dashboard-customer");
          }
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader className="text-center pb-6">
          <div className="text-6xl mb-4">🕉️</div>
          <CardTitle className="text-3xl font-bold text-orange-800 dark:text-orange-400">
            Welcome to E-GURUji
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
            Connect with authentic spiritual services
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-orange-100 dark:bg-orange-900">
              <TabsTrigger value="login" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
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

                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-2">
                <Label>Account Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={selectedRole === "customer" ? "default" : "outline"}
                    onClick={() => setSelectedRole("customer")}
                    className={selectedRole === "customer" ? "bg-orange-600 hover:bg-orange-700" : "border-orange-200 hover:bg-orange-50 dark:border-orange-700 dark:hover:bg-orange-900"}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Customer
                  </Button>
                  <Button
                    type="button"
                    variant={selectedRole === "pandit" ? "default" : "outline"}
                    onClick={() => setSelectedRole("pandit")}
                    className={selectedRole === "pandit" ? "bg-orange-600 hover:bg-orange-700" : "border-orange-200 hover:bg-orange-50 dark:border-orange-700 dark:hover:bg-orange-900"}
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Pandit
                  </Button>
                </div>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="signup-name"
                      placeholder="Enter your full name"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password (min 6 characters)"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                      className="pl-10 pr-10"
                      minLength={6}
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

                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Mobile Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="Enter your mobile number"
                      value={signupForm.phone}
                      onChange={(e) => setSignupForm({...signupForm, phone: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="signup-address"
                      placeholder="Enter your address"
                      value={signupForm.address}
                      onChange={(e) => setSignupForm({...signupForm, address: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>

                {selectedRole === "pandit" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="signup-expertise">Expertise *</Label>
                      <div className="relative">
                        <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="signup-expertise"
                          placeholder="e.g., Vedic Rituals, Wedding Ceremonies"
                          value={signupForm.expertise}
                          onChange={(e) => setSignupForm({...signupForm, expertise: e.target.value})}
                          className="pl-10"
                          required={selectedRole === "pandit"}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-aadhar">Aadhar Number *</Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="signup-aadhar"
                          placeholder="Enter your 12-digit Aadhar number"
                          value={signupForm.aadhar_number}
                          onChange={(e) => setSignupForm({...signupForm, aadhar_number: e.target.value})}
                          className="pl-10"
                          maxLength={12}
                          pattern="[0-9]{12}"
                          required={selectedRole === "pandit"}
                        />
                      </div>
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
