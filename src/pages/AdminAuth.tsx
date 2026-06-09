import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react";

type HCaptchaApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    }
  ) => string | number;
  reset: (widgetId?: string | number) => void;
};

declare global {
  interface Window {
    hcaptcha?: HCaptchaApi;
  }
}

const ADMIN_EMAIL = "admin@eguruji.com";
const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY as string | undefined;

export default function AdminAuth() {
  const navigate = useNavigate();
  const { user, loading } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const captchaContainerRef = useRef<HTMLDivElement | null>(null);
  const captchaWidgetIdRef = useRef<string | number | null>(null);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const checkAdminStatus = useCallback(async () => {
    if (!user) return;

    try {
      const { data: adminProfile } = await supabase
        .from("admin_profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (adminProfile) {
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("adminEmail", adminProfile.email);
        navigate("/dashboard-admin");
        return;
      }

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
  }, [user, navigate]);

  useEffect(() => {
    if (user && !loading) {
      checkAdminStatus();
    }
  }, [user, loading, checkAdminStatus]);

  useEffect(() => {
    if (!HCAPTCHA_SITE_KEY || captchaWidgetIdRef.current !== null) {
      return;
    }

    const renderCaptcha = () => {
      if (!window.hcaptcha || !captchaContainerRef.current || captchaWidgetIdRef.current !== null) {
        return;
      }

      captchaWidgetIdRef.current = window.hcaptcha.render(captchaContainerRef.current, {
        sitekey: HCAPTCHA_SITE_KEY,
        callback: setCaptchaToken,
        "expired-callback": () => setCaptchaToken(""),
        "error-callback": () => setCaptchaToken(""),
      });
    };

    if (window.hcaptcha) {
      renderCaptcha();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[src^="https://js.hcaptcha.com/1/api.js"]');
    if (existingScript) {
      existingScript.addEventListener("load", renderCaptcha, { once: true });
      return () => existingScript.removeEventListener("load", renderCaptcha);
    }

    const script = document.createElement("script");
    script.src = "https://js.hcaptcha.com/1/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.addEventListener("load", renderCaptcha, { once: true });
    document.head.appendChild(script);

    return () => script.removeEventListener("load", renderCaptcha);
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (HCAPTCHA_SITE_KEY && !captchaToken) {
        toast({
          title: "CAPTCHA Required",
          description: "Please complete the CAPTCHA verification.",
          variant: "destructive",
        });
        return;
      }

      const email = loginForm.email.trim().toLowerCase();
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: loginForm.password,
        options: {
          captchaToken: HCAPTCHA_SITE_KEY ? captchaToken : undefined,
        },
      });

      if (authError) {
        toast({
          title: "Login Failed",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }

      if (authData.user && email === ADMIN_EMAIL) {
        const { data: existingProfile } = await supabase
          .from("admin_profiles")
          .select("*")
          .eq("id", authData.user.id)
          .maybeSingle();

        if (!existingProfile) {
          const { error: profileError } = await supabase
            .from("admin_profiles")
            .insert({
              id: authData.user.id,
              name: "Admin",
              email: authData.user.email || email,
            });

          if (profileError) {
            console.error("Error creating admin profile:", profileError);
            toast({
              title: "Profile Error",
              description: "Failed to create admin profile.",
              variant: "destructive",
            });
            return;
          }
        }

        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("adminEmail", authData.user.email || email);

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
      if (HCAPTCHA_SITE_KEY && window.hcaptcha && captchaWidgetIdRef.current !== null) {
        window.hcaptcha.reset(captchaWidgetIdRef.current);
        setCaptchaToken("");
      }
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-orange-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-orange-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm shadow-2xl border-orange-200">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-orange-600 dark:text-orange-400" />
          </div>
          <CardTitle className="text-3xl font-bold text-orange-800 dark:text-orange-400">
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
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="pl-10 border-orange-200 focus-visible:ring-orange-500"
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
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="pl-10 pr-10 border-orange-200 focus-visible:ring-orange-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {HCAPTCHA_SITE_KEY ? (
              <div className="flex justify-center rounded-md border border-orange-100 bg-white p-3">
                <div ref={captchaContainerRef} />
              </div>
            ) : (
              <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                CAPTCHA is enabled in code. Add VITE_HCAPTCHA_SITE_KEY to .env when CAPTCHA is enabled in Supabase.
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700"
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
              Back to User Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
