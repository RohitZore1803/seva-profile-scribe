
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Video, Edit, Eye, Play } from "lucide-react";
import { useLiveStreams } from "@/hooks/useLiveStreams";
import { useProfile } from "@/hooks/useProfile";
import LiveStreamCard from "@/components/LiveStreamCard";
import LiveStreamEditModal from "@/components/LiveStreamEditModal";
import { toast } from "@/hooks/use-toast";

export default function LiveStreams() {
  const { profile } = useProfile();
  const { streams, loading, createStream, updateStream, fetchStreams } = useLiveStreams();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingStream, setEditingStream] = useState(null);
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
    const stream = streams.find(s => s.id === streamId);
    if (stream?.stream_url) {
      window.open(stream.stream_url, '_blank');
    } else {
      toast({
        title: "Stream Not Available",
        description: "This stream is not yet available for viewing",
        variant: "destructive",
      });
    }
  };

  const handleStartStream = (streamId: string) => {
    updateStream(streamId, { 
      status: 'live', 
      started_at: new Date().toISOString(),
      viewer_count: 0 
    });
    toast({
      title: "Stream Started",
      description: "Your live stream is now active!",
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
              <Card key={stream.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{stream.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{stream.description}</p>
                    </div>
                    {profile?.user_type === 'pandit' && profile.id === stream.pandit_id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingStream(stream)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Status:</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        stream.status === 'live' ? 'bg-red-100 text-red-700' :
                        stream.status === 'scheduled' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {stream.status}
                      </span>
                    </div>
                    
                    {stream.scheduled_at && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Scheduled:</span>
                        <span>{new Date(stream.scheduled_at).toLocaleString()}</span>
                      </div>
                    )}
                    
                    {stream.is_premium && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Price:</span>
                        <span className="font-semibold text-orange-600">₹{stream.price}</span>
                      </div>
                    )}
                    
                    <div className="flex gap-2 mt-4">
                      {profile?.user_type === 'pandit' && profile.id === stream.pandit_id ? (
                        <Button
                          onClick={() => handleStartStream(stream.id)}
                          disabled={stream.status === 'live'}
                          className="flex-1 bg-orange-600 hover:bg-orange-700"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {stream.status === 'live' ? 'Live' : 'Start Stream'}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleJoinStream(stream.id)}
                          disabled={stream.status !== 'live'}
                          className="flex-1 bg-orange-600 hover:bg-orange-700"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Watch
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
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

          {editingStream && (
            <LiveStreamEditModal
              stream={editingStream}
              isOpen={!!editingStream}
              onClose={() => setEditingStream(null)}
              onUpdate={updateStream}
            />
          )}
        </div>
      </div>
    </div>
  );
}
