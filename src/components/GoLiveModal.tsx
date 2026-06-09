
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, Mic, Settings, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useSession } from '@/hooks/useSession';

interface GoLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoLive: (streamData: any) => void;
}

export default function GoLiveModal({ isOpen, onClose, onGoLive }: GoLiveModalProps) {
  const { user } = useSession();
  const [streamData, setStreamData] = useState({
    title: '',
    description: '',
    is_premium: false,
    price: 0,
  });
  const [loading, setLoading] = useState(false);
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);

  const startPreview = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
      toast({
        title: "Media Support Error",
        description: !isSecure
          ? "Camera/Mic access requires a secure (HTTPS) connection. Please check your URL."
          : "Your browser does not support camera/microphone access in this mode.",
        variant: "destructive",
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });
      setPreviewStream(stream);
    } catch (err: any) {
      console.error("Error accessing media devices:", err);
      let message = "Could not access camera/microphone. Please check permissions.";
      if (err.name === 'NotAllowedError') message = "Permission denied. Please allow camera access in your browser settings.";
      if (err.name === 'NotFoundError') message = "No camera or microphone found on your device.";

      toast({
        title: "Media Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const stopPreview = () => {
    if (previewStream) {
      previewStream.getTracks().forEach(track => track.stop());
      setPreviewStream(null);
    }
  };

  const handleGoLive = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login as a pandit before starting a live stream.",
        variant: "destructive",
      });
      return;
    }

    if (!streamData.title) {
      toast({
        title: "Error",
        description: "Please enter a stream title",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create stream record
      const { data: stream, error } = await supabase
        .from('live_streams')
        .insert({
          ...streamData,
          pandit_id: user?.id,
          stream_key: `stream_${Date.now()}`,
          status: 'scheduled',
        })
        .select()
        .single();

      if (error) throw error;

      // Get LiveKit room token
      const { data: roomData, error: roomError } = await supabase.functions.invoke(
        'create-live-room',
        {
          body: {
            streamId: stream.id,
            role: 'publisher',
          },
        }
      );

      if (roomError) throw roomError;

      onGoLive({
        ...stream,
        livekit: roomData,
      });

      toast({
        title: "Going Live!",
        description: "Your stream is now live",
      });

    } catch (error: any) {
      console.error('Error starting stream:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to start stream. Check LiveKit Edge Function secrets.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-orange-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-900">
            <Video className="w-5 h-5" />
            Go Live
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stream Settings */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-orange-900">Stream Title</Label>
              <Input
                id="title"
                value={streamData.title}
                onChange={(e) => setStreamData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter stream title"
                className="border-orange-200 focus-visible:ring-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-orange-900">Description</Label>
              <Textarea
                id="description"
                value={streamData.description}
                onChange={(e) => setStreamData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your stream"
                rows={3}
                className="border-orange-200 focus-visible:ring-orange-500"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="premium"
                  checked={streamData.is_premium}
                  onChange={(e) => setStreamData(prev => ({ ...prev, is_premium: e.target.checked }))}
                />
                <Label htmlFor="premium" className="text-orange-900">Premium Stream</Label>
              </div>

              {streamData.is_premium && (
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-orange-900">Price (INR)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={streamData.price}
                    onChange={(e) => setStreamData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                    min="0"
                    className="border-orange-200 focus-visible:ring-orange-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Camera Preview */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-orange-900">Camera Preview</Label>
              <Card className="bg-black aspect-video">
                <CardContent className="p-0 h-full">
                  {previewStream ? (
                    <video
                      autoPlay
                      muted
                      playsInline
                      ref={(video) => {
                        if (video && previewStream) {
                          video.srcObject = previewStream;
                        }
                      }}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white">
                      <div className="text-center">
                        <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm opacity-75">No camera preview</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-2">
              {!previewStream ? (
                <Button onClick={startPreview} variant="outline" className="flex-1">
                  <Video className="w-4 h-4 mr-2" />
                  Start Preview
                </Button>
              ) : (
                <Button onClick={stopPreview} variant="outline" className="flex-1">
                  <Video className="w-4 h-4 mr-2" />
                  Stop Preview
                </Button>
              )}
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <h3 className="font-semibold mb-2 text-orange-900">Stream Info</h3>
              <div className="space-y-1 text-sm text-orange-700">
                <div className="flex justify-between">
                  <span>Resolution:</span>
                  <span>1280x720</span>
                </div>
                <div className="flex justify-between">
                  <span>Protocol:</span>
                  <span>WebRTC</span>
                </div>
                <div className="flex justify-between">
                  <span>Audio:</span>
                  <span>Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleGoLive}
            disabled={loading || !streamData.title}
            className="bg-red-600 hover:bg-red-700 text-white flex-1"
          >
            {loading ? 'Starting...' : 'Go Live'}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
