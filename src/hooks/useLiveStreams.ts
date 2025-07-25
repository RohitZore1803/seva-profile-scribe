
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";
import { toast } from "@/hooks/use-toast";

export interface LiveStream {
  id: string;
  title: string;
  description?: string;
  pandit_id?: string;
  scheduled_at?: string;
  started_at?: string;
  ended_at?: string;
  status: string;
  stream_url?: string;
  stream_key: string;
  recording_url?: string;
  price?: number;
  is_premium?: boolean;
  max_viewers?: number;
  viewer_count?: number;
  created_at: string;
  updated_at: string;
}

export function useLiveStreams() {
  const { user } = useSession();
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLiveStreams();
    }
  }, [user]);

  const fetchLiveStreams = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('live_streams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStreams(data || []);
    } catch (error) {
      console.error("Error fetching live streams:", error);
    } finally {
      setLoading(false);
    }
  };

  const createStream = async (streamData: Partial<LiveStream>) => {
    if (!user) return;

    // Ensure required fields are present
    if (!streamData.title) {
      toast({
        title: "Error",
        description: "Stream title is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const dataToInsert = {
        ...streamData,
        pandit_id: user.id,
        stream_key: `stream_${Date.now()}`,
        title: streamData.title,
      };

      const { data, error } = await supabase
        .from('live_streams')
        .insert(dataToInsert)
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
      console.error("Error creating live stream:", error);
      toast({
        title: "Error",
        description: "Failed to create live stream",
        variant: "destructive",
      });
    }
  };

  const updateStream = async (id: string, streamData: Partial<LiveStream>) => {
    try {
      const { data, error } = await supabase
        .from('live_streams')
        .update(streamData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setStreams(prev => prev.map(stream => 
        stream.id === id ? data : stream
      ));
      
      toast({
        title: "Success",
        description: "Live stream updated successfully",
      });
      
      return data;
    } catch (error) {
      console.error("Error updating live stream:", error);
      toast({
        title: "Error",
        description: "Failed to update live stream",
        variant: "destructive",
      });
    }
  };

  const deleteStream = async (id: string) => {
    try {
      const { error } = await supabase
        .from('live_streams')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setStreams(prev => prev.filter(stream => stream.id !== id));
      toast({
        title: "Success",
        description: "Live stream deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting live stream:", error);
      toast({
        title: "Error",
        description: "Failed to delete live stream",
        variant: "destructive",
      });
    }
  };

  return {
    streams,
    loading,
    createStream,
    updateStream,
    deleteStream,
    fetchLiveStreams,
  };
}
