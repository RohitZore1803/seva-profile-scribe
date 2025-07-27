
import { useEffect, useState } from 'react';
import {
  LiveKitRoom as LiveKitRoomComponent,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  useParticipants,
} from '@livekit/components-react';

import '@livekit/components-styles';

import { Track, Room } from 'livekit-client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface LiveKitRoomProps {
  token: string;
  serverUrl: string;
  roomName: string;
  onDisconnect: () => void;
  isPublisher?: boolean;
}

export default function CustomLiveKitRoom({
  token,
  serverUrl,
  roomName,
  onDisconnect,
  isPublisher = false,
}: LiveKitRoomProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [viewerCount, setViewerCount] = useState(0);

  const handleConnected = (connectedRoom: Room) => {
    setIsConnected(true);
    setRoom(connectedRoom);
  };

  useEffect(() => {
    if (!room) return;

    const updateViewerCount = () => setViewerCount(room.numParticipants);

    room.on('participantConnected', updateViewerCount);
    room.on('participantDisconnected', updateViewerCount);
    room.on('connectionStateChanged', (state) => {
      if (state === 'disconnected') {
        console.warn('LiveKit room disconnected');
      }
    });
    room.on('connectionStateChanged', (state) => {
  if (state === 'disconnected') {
    console.warn('LiveKit room disconnected');
  }
  
});


    updateViewerCount();

    return () => {
      room.off('participantConnected', updateViewerCount);
      room.off('participantDisconnected', updateViewerCount);
    };
  }, [room]);

  if (!isConnected) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white">
        <p>Connecting to live stream...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <LiveKitRoomComponent
        video={isPublisher}
        audio={isPublisher}
        token={token}
        serverUrl={serverUrl}
        data-lk-theme="default"
        style={{ height: '100vh' }}
        onConnected={handleConnected}
        onDisconnected={() => {
          setIsConnected(false);
          setRoom(null);
          onDisconnect();
        }}
      >
        <div className="flex flex-col h-full">
          <div className="bg-black text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="destructive" className="bg-red-600">
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
                End Stream
              </Button>
            </div>
          </div>

          <div className="flex-1 bg-black relative">
            {isPublisher ? (
              <PublisherView room={room} />
            ) : (
              <ViewerInterface />
            )}
          </div>
        </div>

        <RoomAudioRenderer />
      </LiveKitRoomComponent>
    </div>
  );
}

function PublisherView({ room }: { room: Room | null }) {
  const participants = useParticipants();
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-4">
      {room?.localParticipant && (
        <ParticipantTile
          key={room.localParticipant.sid}
          participant={room.localParticipant}
          style={{ height: '100%', width: '100%' }}
          displayName
        />
      )}

      {participants.map((participant) => (
        <ParticipantTile
          key={participant.sid}
          participant={participant}
          style={{ height: '100%', width: '100%' }}
          displayName
        />
      ))}

      {tracks.map((track) => (
        <ParticipantTile key={track.trackSid} track={track} style={{ height: '100%', width: '100%' }} />
      ))}
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
            <div className="animate-pulse">🔴</div>
          </div>
        </div>
      )}
    </div>
  );
}
