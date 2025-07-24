
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";
import { toast } from "@/hooks/use-toast";

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price_monthly: number;
  price_yearly?: number;
  features: any;
  is_active: boolean;
  created_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  started_at: string;
  expires_at?: string;
  auto_renew: boolean;
  payment_method?: string;
  created_at: string;
}

export function useSubscriptions() {
  const { user } = useSession();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlans();
    if (user) {
      fetchUserSubscription();
    }
  }, [user]);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("is_active", true)
        .order("price_monthly", { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
    }
  };

  const fetchUserSubscription = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setUserSubscription(data);
    } catch (error) {
      console.error("Error fetching user subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToPlan = async (planId: string, paymentMethod: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .insert({
          user_id: user.id,
          plan_id: planId,
          status: "active",
          payment_method: paymentMethod,
          started_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        })
        .select()
        .single();

      if (error) throw error;
      
      setUserSubscription(data);
      toast({
        title: "Success",
        description: "Successfully subscribed to plan",
      });
      
      return data;
    } catch (error) {
      console.error("Error subscribing to plan:", error);
      toast({
        title: "Error",
        description: "Failed to subscribe to plan",
        variant: "destructive",
      });
    }
  };

  return {
    plans,
    userSubscription,
    loading,
    subscribeToPlan,
    fetchPlans,
    fetchUserSubscription,
  };
}
