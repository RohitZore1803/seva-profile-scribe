
import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import LiveKitRoom from './LiveKitRoom';

interface LiveStreamViewerProps {
  streamId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function LiveStreamViewer({ streamId, isOpen, onClose }: LiveStreamViewerProps) {
  const [loading, setLoading] = useState(true);
  const [roomData, setRoomData] = useState<any>(null);
  const [stream, setStream] = useState<any>(null);

  const joinStream = useCallback(async () => {
    setLoading(true);
    try {
      // Get stream details
      const { data: streamData, error: streamError } = await supabase
        .from('live_streams')
        .select('*')
        .eq('id', streamId)
        .single();

      if (streamError) throw streamError;
      setStream(streamData);

      // Get viewer token
      const { data: roomData, error: roomError } = await supabase.functions.invoke(
        'create-live-room',
        {
          body: {
            streamId: streamId,
            role: 'viewer',
          },
        }
      );

      if (roomError) throw roomError;
      setRoomData(roomData);

    } catch (error) {
      console.error('Error joining stream:', error);
      toast({
        title: "Error",
        description: "Failed to join stream",
        variant: "destructive",
      });
      onClose();
    } finally {
      setLoading(false);
    }
  }, [streamId, onClose]);

  useEffect(() => {
    if (isOpen && streamId) {
      joinStream();
    }
  }, [isOpen, streamId, joinStream]);

  const handleDisconnect = () => {
    setRoomData(null);
    setStream(null);
    onClose();
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl h-[80vh]">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4" />
              <p className="text-orange-800">Joining stream...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
        {roomData && stream ? (
          <LiveKitRoom
            token={roomData.token}
            serverUrl={roomData.url}
            roomName={roomData.roomName}
            onDisconnect={handleDisconnect}
            isPublisher={false}
          />
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-lg text-orange-900">Unable to connect to stream</p>
              <Button onClick={onClose} className="mt-4 bg-orange-600 hover:bg-orange-700">
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
