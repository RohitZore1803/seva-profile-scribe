
import { useEffect, useState } from 'react';
import {
  LiveKitRoom as LiveKitRoomComponent,
  VideoConference,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track } from 'livekit-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Mic, MicOff, Video, VideoOff } from 'lucide-react';

interface LiveKitRoomProps {
  token: string;
  serverUrl: string;
  roomName: string;
  onDisconnect: () => void;
  isPublisher?: boolean;
}

export default function LiveKitRoom({ 
  token, 
  serverUrl, 
  roomName, 
  onDisconnect, 
  isPublisher = false 
}: LiveKitRoomProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);

  return (
    <div className="w-full h-full">
      <LiveKitRoomComponent
        video={isPublisher}
        audio={isPublisher}
        token={token}
        serverUrl={serverUrl}
        data-lk-theme="default"
        style={{ height: '100vh' }}
        onConnected={() => setIsConnected(true)}
        onDisconnected={onDisconnect}
        onParticipantCountChanged={setViewerCount}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
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

          {/* Video Content */}
          <div className="flex-1 bg-black relative">
            {isPublisher ? (
              <PublisherView />
            ) : (
              <ViewerInterface />
            )}
          </div>

          {/* Controls */}
          {isPublisher && (
            <div className="bg-gray-900 p-4">
              <ControlBar 
                variation="minimal"
                controls={{
                  microphone: true,
                  camera: true,
                  screenShare: true,
                  chat: false,
                  settings: true,
                  leave: false,
                }}
              />
            </div>
          )}
        </div>
        
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
            <div className="animate-pulse">🔴</div>
          </div>
        </div>
      )}
    </div>
  );
}
