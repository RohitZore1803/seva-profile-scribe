
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";
import { toast } from "@/hooks/use-toast";

export interface LiveStream {
  id: string;
  title: string;
  description?: string;
  pandit_id: string;
  scheduled_at?: string;
  started_at?: string;
  ended_at?: string;
  status: string;
  stream_url?: string;
  stream_key: string;
  recording_url?: string;
  viewer_count: number;
  max_viewers: number;
  is_premium: boolean;
  price: number;
  created_at: string;
  updated_at: string;
}

export function useLiveStreams() {
  const { user } = useSession();
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStreams();
  }, []);

  const fetchStreams = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("live_streams")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStreams(data || []);
    } catch (error) {
      console.error("Error fetching live streams:", error);
      toast({
        title: "Error",
        description: "Failed to load live streams",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createStream = async (streamData: Partial<LiveStream>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("live_streams")
        .insert({
          ...streamData,
          pandit_id: user.id,
          stream_key: `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        })
        .select()
        .single();

      if (error) throw error;
      
      setStreams(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Live stream created successfully",
      });
      
      return data;
    } catch (error) {
      console.error("Error creating stream:", error);
      toast({
        title: "Error",
        description: "Failed to create live stream",
        variant: "destructive",
      });
    }
  };

  const updateStream = async (streamId: string, updates: Partial<LiveStream>) => {
    try {
      const { data, error } = await supabase
        .from("live_streams")
        .update(updates)
        .eq("id", streamId)
        .select()
        .single();

      if (error) throw error;
      
      setStreams(prev => prev.map(stream => 
        stream.id === streamId ? data : stream
      ));
      
      return data;
    } catch (error) {
      console.error("Error updating stream:", error);
      toast({
        title: "Error",
        description: "Failed to update live stream",
        variant: "destructive",
      });
    }
  };

  return {
    streams,
    loading,
    createStream,
    updateStream,
    fetchStreams,
  };
}
