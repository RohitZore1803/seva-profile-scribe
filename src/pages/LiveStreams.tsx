
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Users, Calendar, Clock, Star, Plus, Video } from "lucide-react";
import { useLiveStreams } from "@/hooks/useLiveStreams";
import { useSession } from "@/hooks/useSession";
import GoLiveModal from "@/components/GoLiveModal";
import LiveStreamViewer from "@/components/LiveStreamViewer";
import LiveKitRoom from "@/components/LiveKitRoom";

export default function LiveStreams() {
  const { user } = useSession();
  const { streams, loading, createStream, updateStream } = useLiveStreams();
  const [activeFilter, setActiveFilter] = useState("all");
  const [showGoLiveModal, setShowGoLiveModal] = useState(false);
  const [selectedStreamId, setSelectedStreamId] = useState<string | null>(null);
  const [liveRoomData, setLiveRoomData] = useState<any>(null);

  const filteredStreams = streams.filter(stream => {
    if (activeFilter === "all") return true;
    return stream.status === activeFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-100 text-red-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "ended":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleGoLive = (streamData: any) => {
    setLiveRoomData(streamData);
    setShowGoLiveModal(false);
  };

  const handleJoinStream = (streamId: string) => {
    setSelectedStreamId(streamId);
  };

  const handleEndStream = () => {
    setLiveRoomData(null);
  };

  // If currently streaming, show the LiveKit room
  if (liveRoomData) {
    return (
      <div className="w-full h-screen">
        <LiveKitRoom
          token={liveRoomData.livekit.token}
          serverUrl={liveRoomData.livekit.url}
          roomName={liveRoomData.livekit.roomName}
          onDisconnect={handleEndStream}
          isPublisher={true}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-800">Loading live streams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-blue-800 mb-2">Live Spiritual Streams</h1>
              <p className="text-blue-600">Join live spiritual sessions and connect with expert pandits</p>
            </div>
            {user && (
              <Button
                onClick={() => setShowGoLiveModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Video className="w-4 h-4 mr-2" />
                Go Live
              </Button>
            )}
          </div>

          <div className="flex gap-2 mb-6">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              onClick={() => setActiveFilter("all")}
              size="sm"
            >
              All Streams
            </Button>
            <Button
              variant={activeFilter === "live" ? "default" : "outline"}
              onClick={() => setActiveFilter("live")}
              size="sm"
            >
              Live Now
            </Button>
            <Button
              variant={activeFilter === "scheduled" ? "default" : "outline"}
              onClick={() => setActiveFilter("scheduled")}
              size="sm"
            >
              Scheduled
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStreams.map((stream) => (
              <Card key={stream.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative bg-gradient-to-br from-orange-200 to-red-200 h-48 flex items-center justify-center">
                    <Play className="w-16 h-16 text-orange-600" />
                    <Badge className={`absolute top-2 right-2 ${getStatusColor(stream.status)}`}>
                      {stream.status.toUpperCase()}
                    </Badge>
                    {stream.status === "live" && (
                      <Badge className="absolute top-2 left-2 bg-red-600 text-white animate-pulse">
                        🔴 LIVE
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2">{stream.title}</CardTitle>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{stream.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{stream.viewer_count || 0}</span>
                    </div>
                    {stream.scheduled_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(stream.scheduled_at).toLocaleDateString()}</span>
                      </div>
                    )}
                    {stream.scheduled_at && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(stream.scheduled_at).toLocaleTimeString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {stream.is_premium && (
                        <Badge variant="secondary">
                          <Star className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                      <span className="font-semibold text-orange-600">
                        {stream.price > 0 ? `₹${stream.price}` : "Free"}
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-orange-600 hover:bg-orange-700"
                      onClick={() => handleJoinStream(stream.id)}
                      disabled={stream.status === "ended"}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {stream.status === "live" ? "Join Live" : "Watch"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredStreams.length === 0 && (
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No streams found</h3>
              <p className="text-gray-500 mb-4">Check back later for new spiritual sessions</p>
              {user && (
                <Button
                  onClick={() => setShowGoLiveModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Start Your First Stream
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <GoLiveModal
        isOpen={showGoLiveModal}
        onClose={() => setShowGoLiveModal(false)}
        onGoLive={handleGoLive}
      />

      {selectedStreamId && (
        <LiveStreamViewer
          streamId={selectedStreamId}
          isOpen={!!selectedStreamId}
          onClose={() => setSelectedStreamId(null)}
        />
      )}
    </div>
  );
}
