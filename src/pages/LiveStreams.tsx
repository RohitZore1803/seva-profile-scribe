
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Video } from "lucide-react";
import { useLiveStreams } from "@/hooks/useLiveStreams";
import { useProfile } from "@/hooks/useProfile";
import LiveStreamCard from "@/components/LiveStreamCard";
import { toast } from "@/hooks/use-toast";

export default function LiveStreams() {
  const { profile } = useProfile();
  const { streams, loading, createStream, fetchStreams } = useLiveStreams();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduled_at: "",
    is_premium: false,
    price: 0,
  });

  useEffect(() => {
    fetchStreams();
  }, []);

  const handleCreateStream = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) {
      toast({
        title: "Error",
        description: "Please complete your profile first",
        variant: "destructive",
      });
      return;
    }

    const result = await createStream(formData);
    if (result) {
      setShowCreateForm(false);
      setFormData({
        title: "",
        description: "",
        scheduled_at: "",
        is_premium: false,
        price: 0,
      });
    }
  };

  const handleJoinStream = (streamId: string) => {
    // This would typically open a video streaming interface
    toast({
      title: "Stream Access",
      description: "Opening stream viewer...",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-orange-800 mb-2">Live Streams</h1>
              <p className="text-orange-600">Watch live spiritual sessions and connect with pandits</p>
            </div>
            
            {profile?.user_type === 'pandit' && (
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Stream
              </Button>
            )}
          </div>

          {showCreateForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Create New Live Stream
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateStream} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Stream Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter stream title"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="scheduled_at">Scheduled Time</Label>
                      <Input
                        id="scheduled_at"
                        type="datetime-local"
                        value={formData.scheduled_at}
                        onChange={(e) => setFormData(prev => ({ ...prev, scheduled_at: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your stream"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_premium"
                        checked={formData.is_premium}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_premium: checked }))}
                      />
                      <Label htmlFor="is_premium">Premium Stream</Label>
                    </div>
                    
                    {formData.is_premium && (
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                          className="w-24"
                          min="0"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                      Create Stream
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streams.map((stream) => (
              <LiveStreamCard
                key={stream.id}
                stream={stream}
                onJoin={handleJoinStream}
              />
            ))}
          </div>

          {streams.length === 0 && !loading && (
            <Card className="text-center py-12">
              <CardContent>
                <Video className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No Live Streams</h3>
                <p className="text-gray-600">Check back later for live spiritual sessions</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
