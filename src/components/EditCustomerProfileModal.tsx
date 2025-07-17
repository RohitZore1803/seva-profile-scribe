
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Upload, X, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface EditCustomerProfileModalProps {
  open: boolean;
  onClose: () => void;
  profile: any;
  onProfileUpdated: (profile: any) => void;
}

export default function EditCustomerProfileModal({
  open,
  onClose,
  profile,
  onProfileUpdated,
}: EditCustomerProfileModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile && open) {
      setFormData({
        name: profile.name || "",
        address: profile.address || "",
        phone: profile.phone || "",
      });
      setPreviewUrl(profile.profile_image_url || null);
      setProfileImage(null);
    }
  }, [profile, open]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setProfileImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setPreviewUrl(profile?.profile_image_url || null);
  };

  const uploadProfileImage = async (): Promise<string | null> => {
    if (!profileImage) return null;

    setUploading(true);
    try {
      const fileExt = profileImage.name.split('.').pop();
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      // Delete old image if exists
      if (profile.profile_image_url) {
        const oldPath = profile.profile_image_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('avatars')
            .remove([`profiles/${oldPath}`]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, profileImage, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Failed to upload image');
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload new profile image if selected
      let profileImageUrl = profile?.profile_image_url;
      if (profileImage) {
        profileImageUrl = await uploadProfileImage();
      }

      // Update profile in the unified profiles table
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          profile_image_url: profileImageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)
        .select()
        .single();

      if (error) {
        console.error('Profile update error:', error);
        throw new Error('Failed to update profile');
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });

      onProfileUpdated(data);
      onClose();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!profile?.profile_image_url) return;

    setLoading(true);
    try {
      // Delete image from storage
      const imagePath = profile.profile_image_url.split('/').pop();
      if (imagePath) {
        await supabase.storage
          .from('avatars')
          .remove([`profiles/${imagePath}`]);
      }

      // Update profile to remove image URL
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          profile_image_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)
        .select()
        .single();

      if (error) {
        console.error('Error removing image:', error);
        throw new Error('Failed to remove image');
      }

      setPreviewUrl(null);
      onProfileUpdated(data);
      
      toast({
        title: "Image Removed",
        description: "Profile image has been removed successfully",
      });
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to remove image",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Image Upload */}
          <div className="space-y-2">
            <Label>Profile Photo</Label>
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={previewUrl || undefined} />
                <AvatarFallback className="text-2xl">
                  {formData.name.charAt(0).toUpperCase() || <Camera className="w-8 h-8" />}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex gap-2">
                <Label htmlFor="profile-image" className="cursor-pointer">
                  <Button type="button" variant="outline" size="sm" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    {previewUrl ? 'Change' : 'Upload'} Photo
                  </Button>
                  <Input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </Label>
                
                {profileImage && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeImage}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                )}
                
                {previewUrl && !profileImage && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteImage}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Enter your full name"
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter your phone number"
            />
          </div>

          {/* Address Field */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter your address"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 flex items-center gap-2"
              disabled={loading || uploading}
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : uploading ? 'Uploading...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
