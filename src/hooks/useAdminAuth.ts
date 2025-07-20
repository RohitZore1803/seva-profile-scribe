
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useAdminAuth() {
  const [loading, setLoading] = useState(false);

  const adminLogin = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Use Supabase auth for admin login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error };
      }

      // Check if this is an admin user
      if (data.user && email === "admin@eguruji.com") {
        // Check if admin profile exists, create if not
        const { data: existingProfile } = await supabase
          .from("admin_profiles")
          .select("*")
          .eq("id", data.user.id)
          .maybeSingle();

        if (!existingProfile) {
          await supabase
            .from("admin_profiles")
            .insert({
              id: data.user.id,
              name: "Admin",
              email: data.user.email || email,
            });
        }

        toast({
          title: "Success",
          description: "Admin login successful",
        });

        return { success: true, data };
      } else {
        // Not an admin, sign out
        await supabase.auth.signOut();
        toast({
          title: "Access Denied",
          description: "Invalid admin credentials",
          variant: "destructive",
        });
        return { success: false, error: new Error("Invalid admin credentials") };
      }
    } catch (error) {
      console.error("Admin login error:", error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    adminLogin,
    loading,
  };
}
