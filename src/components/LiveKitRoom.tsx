
import { useEffect, useState } from 'react';
import {
  LiveKitRoom as LiveKitRoomComponent,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  useParticipants,
  useRoomContext,
} from '@livekit/components-react';

import '@livekit/components-styles';

import { Track } from 'livekit-client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Loader2 } from 'lucide-react';

interface LiveKitRoomProps {
  token: string;
  serverUrl: string;
  roomName: string;
  onDisconnect: () => void;
  isPublisher?: boolean;
}

// Inner component that uses room context; must be inside <LiveKitRoomComponent>
function RoomContent({
  roomName,
  isPublisher,
  onDisconnect,
}: {
  roomName: string;
  isPublisher: boolean;
  onDisconnect: () => void;
}) {
  const room = useRoomContext();
  const [viewerCount, setViewerCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!room) return;

    const onConnected = () => {
      setIsConnected(true);
      setViewerCount(room.numParticipants);
    };
    const updateCount = () => setViewerCount(room.numParticipants);

    room.on('connected', onConnected);
    room.on('participantConnected', updateCount);
    room.on('participantDisconnected', updateCount);

    // Room might already be connected when this component mounts
    if (room.state === 'connected') {
      setIsConnected(true);
      setViewerCount(room.numParticipants);
    }

    return () => {
      room.off('connected', onConnected);
      room.off('participantConnected', updateCount);
      room.off('participantDisconnected', updateCount);
    };
  }, [room]);

  if (!isConnected) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3 text-orange-400" />
          <p className="text-lg">Connecting to live stream...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-black text-white p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Badge variant="destructive" className="bg-red-600 animate-pulse">
            <span className="mr-1 h-2 w-2 rounded-full bg-white" />
            LIVE
          </Badge>
          <span className="text-lg font-semibold">{roomName}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{viewerCount}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onDisconnect}
            className="bg-red-600 hover:bg-red-700 text-white border-red-600"
          >
            {isPublisher ? 'End Stream' : 'Leave'}
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-black relative overflow-hidden">
        {isPublisher ? (
          <PublisherView />
        ) : (
          <ViewerInterface />
        )}
      </div>
    </div>
  );
}

export default function CustomLiveKitRoom({
  token,
  serverUrl,
  roomName,
  onDisconnect,
  isPublisher = false,
}: LiveKitRoomProps) {
  return (
    <div className="w-full h-full">
      <LiveKitRoomComponent
        video={isPublisher}
        audio={isPublisher}
        token={token}
        serverUrl={serverUrl}
        data-lk-theme="default"
        style={{ height: '100%' }}
        onDisconnected={onDisconnect}
      >
        <RoomContent
          roomName={roomName}
          isPublisher={isPublisher}
          onDisconnect={onDisconnect}
        />
        <RoomAudioRenderer />
      </LiveKitRoomComponent>
    </div>
  );
}

function PublisherView() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <div className="w-full h-full">
      <GridLayout tracks={tracks} style={{ height: '100%' }}>
        <ParticipantTile />
      </GridLayout>
    </div>
  );
}

function ViewerInterface() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: true }
  );

  return (
    <div className="w-full h-full">
      {tracks.length > 0 ? (
        <GridLayout tracks={tracks} style={{ height: '100%' }}>
          <ParticipantTile />
        </GridLayout>
      ) : (
        <div className="flex items-center justify-center h-full text-white">
          <div className="text-center">
            <div className="text-2xl mb-4">Waiting for stream to start...</div>
            <div className="mx-auto h-6 w-6 animate-pulse rounded-full bg-red-600" />
          </div>
        </div>
      )}
    </div>
  );
}
