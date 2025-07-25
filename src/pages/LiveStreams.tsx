
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Users, Calendar, Clock, Star } from "lucide-react";
import { useLiveStreams } from "@/hooks/useLiveStreams";
import { useSession } from "@/hooks/useSession";

export default function LiveStreams() {
  const { user } = useSession();
  const { streams, loading, createStream, updateStream } = useLiveStreams();
  const [activeFilter, setActiveFilter] = useState("all");

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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-800 mb-2">Live Spiritual Streams</h1>
            <p className="text-blue-600">Join live spiritual sessions and connect with expert pandits</p>
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
              <Card key={stream.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative bg-gradient-to-br from-orange-200 to-red-200 h-48 flex items-center justify-center">
                    <Play className="w-16 h-16 text-orange-600" />
                    <Badge className={`absolute top-2 right-2 ${getStatusColor(stream.status)}`}>
                      {stream.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2">{stream.title}</CardTitle>
                  <p className="text-gray-600 text-sm mb-3">{stream.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{stream.viewer_count}</span>
                    </div>
                    {stream.scheduled_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(stream.scheduled_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">Premium</span>
                    </div>
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                      {stream.status === "live" ? "Join Live" : "Schedule"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredStreams.length === 0 && (
            <div className="text-center py-12">
              <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No streams found</h3>
              <p className="text-gray-500">Check back later for new spiritual sessions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
