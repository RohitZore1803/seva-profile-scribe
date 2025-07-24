
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";
import { toast } from "@/hooks/use-toast";

export interface LoyaltyProgram {
  id: string;
  user_id: string;
  points_balance: number;
  total_points_earned: number;
  total_points_redeemed: number;
  tier_level: string;
  last_activity_at: string;
  created_at: string;
}

export interface PointTransaction {
  id: string;
  user_id: string;
  points: number;
  transaction_type: string;
  source: string;
  description?: string;
  booking_id?: string;
  created_at: string;
}

export function useLoyaltyProgram() {
  const { user } = useSession();
  const [loyaltyProgram, setLoyaltyProgram] = useState<LoyaltyProgram | null>(null);
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLoyaltyProgram();
      fetchTransactions();
    }
  }, [user]);

  const fetchLoyaltyProgram = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("loyalty_programs")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // Create loyalty program if it doesn't exist
        const { data: newProgram, error: createError } = await supabase
          .from("loyalty_programs")
          .insert({
            user_id: user.id,
            points_balance: 0,
            total_points_earned: 0,
            total_points_redeemed: 0,
            tier_level: 'bronze',
          })
          .select()
          .single();

        if (createError) throw createError;
        setLoyaltyProgram(newProgram);
      } else {
        setLoyaltyProgram(data);
      }
    } catch (error) {
      console.error("Error fetching loyalty program:", error);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("point_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching point transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTierLevel = (totalPoints: number) => {
    if (totalPoints >= 10000) return 'platinum';
    if (totalPoints >= 5000) return 'gold';
    if (totalPoints >= 1000) return 'silver';
    return 'bronze';
  };

  return {
    loyaltyProgram,
    transactions,
    loading,
    fetchLoyaltyProgram,
    fetchTransactions,
    getTierLevel,
  };
}
