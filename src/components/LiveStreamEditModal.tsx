
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { LiveStream } from "@/hooks/useLiveStreams";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface LiveStreamEditModalProps {
  stream: LiveStream;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (streamId: string, updates: Partial<LiveStream>) => void;
}

export default function LiveStreamEditModal({ stream, isOpen, onClose, onUpdate }: LiveStreamEditModalProps) {
  const [formData, setFormData] = useState({
    title: stream.title,
    description: stream.description || "",
    scheduled_at: stream.scheduled_at ? new Date(stream.scheduled_at).toISOString().slice(0, 16) : "",
    is_premium: stream.is_premium,
    price: stream.price,
    stream_url: stream.stream_url || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(stream.id, formData);
    onClose();
  };

  const generateStreamUrl = () => {
    const streamUrl = `${window.location.origin}/stream/${stream.id}`;
    setFormData(prev => ({ ...prev, stream_url: streamUrl }));
    toast({
      title: "Stream URL Generated",
      description: "You can now share this URL with viewers",
    });
  };

  const copyStreamUrl = () => {
    if (formData.stream_url) {
      navigator.clipboard.writeText(formData.stream_url);
      toast({
        title: "Copied!",
        description: "Stream URL copied to clipboard",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Live Stream</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="stream_url">Stream URL</Label>
            <div className="flex gap-2">
              <Input
                id="stream_url"
                value={formData.stream_url}
                onChange={(e) => setFormData(prev => ({ ...prev, stream_url: e.target.value }))}
                placeholder="Stream URL for viewers"
                readOnly
              />
              <Button
                type="button"
                variant="outline"
                onClick={generateStreamUrl}
                className="px-3"
              >
                Generate
              </Button>
              {formData.stream_url && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={copyStreamUrl}
                    className="px-3"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.open(formData.stream_url, '_blank')}
                    className="px-3"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
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
              Update Stream
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
