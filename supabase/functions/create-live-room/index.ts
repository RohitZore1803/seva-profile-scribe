
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { AccessToken } from "https://esm.sh/livekit-server-sdk@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { streamId, role = 'publisher' } = await req.json();

    // LiveKit configuration
    const LIVEKIT_API_KEY = Deno.env.get('LIVEKIT_API_KEY');
    const LIVEKIT_API_SECRET = Deno.env.get('LIVEKIT_API_SECRET');
    const LIVEKIT_URL = Deno.env.get('LIVEKIT_URL') || 'wss://your-livekit-server.com';

    if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
      return new Response(JSON.stringify({ error: 'LiveKit credentials not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate access token
    const accessToken = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: user.id,
      name: user.email || user.id,
    });

    // Set permissions based on role
    if (role === 'publisher') {
      accessToken.addGrant({
        roomJoin: true,
        room: streamId,
        canPublish: true,
        canPublishData: true,
        canSubscribe: true,
      });
    } else {
      accessToken.addGrant({
        roomJoin: true,
        room: streamId,
        canPublish: false,
        canPublishData: false,
        canSubscribe: true,
      });
    }

    const jwt = await accessToken.toJwt();

    // Update stream with LiveKit room info
    if (role === 'publisher') {
      await supabase
        .from('live_streams')
        .update({
          stream_url: `${LIVEKIT_URL}?token=${jwt}`,
          status: 'live',
          started_at: new Date().toISOString(),
        })
        .eq('id', streamId);
    }

    return new Response(JSON.stringify({
      token: jwt,
      url: LIVEKIT_URL,
      roomName: streamId,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error creating live room:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
