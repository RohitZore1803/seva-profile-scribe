import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { AccessToken } from "https://esm.sh/livekit-server-sdk@2.13.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { streamId, role = "publisher" } = await req.json();

    if (!streamId || !["publisher", "viewer"].includes(role)) {
      return new Response(JSON.stringify({ error: "Invalid live stream request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization");
    let user: { id: string; email?: string } | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabase.auth.getUser(token);
      user = data.user;
    }

    if (role === "publisher" && !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: stream, error: streamError } = await supabase
      .from("live_streams")
      .select("id, pandit_id, status, title, viewer_count")
      .eq("id", streamId)
      .single();

    if (streamError || !stream) {
      return new Response(JSON.stringify({ error: "Stream not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (role === "publisher" && stream.pandit_id !== user!.id) {
      return new Response(JSON.stringify({ error: "Only the stream owner can publish" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (role === "viewer" && !["live", "scheduled"].includes(stream.status)) {
      return new Response(JSON.stringify({ error: "Stream is not available" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LIVEKIT_API_KEY = Deno.env.get("LIVEKIT_API_KEY");
    const LIVEKIT_API_SECRET = Deno.env.get("LIVEKIT_API_SECRET");
    const LIVEKIT_URL = Deno.env.get("LIVEKIT_URL");

    if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET || !LIVEKIT_URL) {
      return new Response(
        JSON.stringify({
          error: "LiveKit configuration missing. Add LIVEKIT_API_KEY, LIVEKIT_API_SECRET, and LIVEKIT_URL to Supabase Edge Function secrets.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const identity = user?.id ?? `guest-${crypto.randomUUID()}`;
    const accessToken = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity,
      name: user?.email || "Guest Viewer",
    });

    accessToken.addGrant({
      roomJoin: true,
      room: streamId,
      canPublish: role === "publisher",
      canPublishData: role === "publisher",
      canSubscribe: true,
    });

    const jwt = await accessToken.toJwt();

    if (role === "publisher") {
      await supabase
        .from("live_streams")
        .update({
          stream_url: `${LIVEKIT_URL}?token=${jwt}`,
          status: "live",
          started_at: new Date().toISOString(),
        })
        .eq("id", streamId)
        .eq("pandit_id", user!.id);
    } else {
      await supabase
        .from("live_streams")
        .update({ viewer_count: (stream.viewer_count || 0) + 1 })
        .eq("id", streamId);
    }

    return new Response(
      JSON.stringify({
        token: jwt,
        url: LIVEKIT_URL,
        roomName: streamId,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating live room:", error);
    const message = error instanceof Error ? error.message : "Failed to create live room";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
