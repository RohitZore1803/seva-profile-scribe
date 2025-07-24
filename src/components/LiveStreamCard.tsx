
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Play, Users, Calendar, Clock } from "lucide-react";
import { LiveStream } from "@/hooks/useLiveStreams";

interface LiveStreamCardProps {
  stream: LiveStream;
  onJoin?: (streamId: string) => void;
}

export default function LiveStreamCard({ stream, onJoin }: LiveStreamCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-500 text-white";
      case "scheduled":
        return "bg-blue-500 text-white";
      case "ended":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const formatPrice = (price: number) => {
    return price > 0 ? `₹${price}` : "Free";
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{stream.title}</CardTitle>
              <p className="text-sm text-gray-600">{stream.description}</p>
            </div>
          </div>
          <Badge className={getStatusColor(stream.status)}>
            {stream.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-gray-600">
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
              <Badge variant="secondary">Premium</Badge>
            )}
            <span className="font-semibold text-orange-600">
              {formatPrice(stream.price)}
            </span>
          </div>
          
          <Button 
            onClick={() => onJoin?.(stream.id)}
            disabled={stream.status === "ended"}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Play className="w-4 h-4 mr-2" />
            {stream.status === "live" ? "Join Live" : "Watch"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
