
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

interface GoLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoLive: (streamData: any) => void;
}

export default function GoLiveModal({ isOpen, onClose, onGoLive }: GoLiveModalProps) {
  const [streamData, setStreamData] = useState({
    title: '',
    description: '',
    is_premium: false,
    price: 0,
  });
  const [loading, setLoading] = useState(false);
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);

  const startPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });
      setPreviewStream(stream);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Access Error",
        description: "Unable to access camera and microphone",
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

    } catch (error) {
      console.error('Error starting stream:', error);
      toast({
        title: "Error",
        description: "Failed to start stream",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Go Live
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stream Settings */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Stream Title</Label>
              <Input
                id="title"
                value={streamData.title}
                onChange={(e) => setStreamData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter stream title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={streamData.description}
                onChange={(e) => setStreamData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your stream"
                rows={3}
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
                <Label htmlFor="premium">Premium Stream</Label>
              </div>
              
              {streamData.is_premium && (
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={streamData.price}
                    onChange={(e) => setStreamData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Camera Preview */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Camera Preview</Label>
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

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Stream Info</h3>
              <div className="space-y-1 text-sm text-gray-600">
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
