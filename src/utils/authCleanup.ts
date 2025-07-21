
import { supabase } from "@/integrations/supabase/client";

export const cleanupAuthState = () => {
  console.log("Cleaning up auth state...");
  
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
      console.log("Removed auth key:", key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
      console.log("Removed session auth key:", key);
    }
  });
};

export const handleSignOut = async () => {
  try {
    console.log("Starting sign out process...");
    
    // Clean up auth state first
    cleanupAuthState();
    
    // Attempt global sign out
    try {
      await supabase.auth.signOut({ scope: 'global' });
      console.log("Global sign out successful");
    } catch (err) {
      console.log("Global sign out failed, continuing...", err);
    }
    
    // Force page reload for clean state
    window.location.href = '/auth';
  } catch (error) {
    console.error("Sign out error:", error);
    // Force redirect even if sign out fails
    window.location.href = '/auth';
  }
};
