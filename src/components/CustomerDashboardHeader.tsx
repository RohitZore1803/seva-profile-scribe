
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Edit } from "lucide-react";
import { Profile } from "@/hooks/useProfile";

interface CustomerDashboardHeaderProps {
  title: string;
  subtitle: string;
  profile: Profile | null;
  onEditProfile: () => void;
  onLogout: () => void;
}

export default function CustomerDashboardHeader({
  title,
  subtitle,
  profile,
  onEditProfile,
  onLogout,
}: CustomerDashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-orange-800 mb-2">{title}</h1>
        <p className="text-orange-600">{subtitle}</p>
      </div>
      
      <div className="flex items-center gap-4">
        <Button
          onClick={onEditProfile}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-orange-200 text-orange-700 hover:bg-orange-50"
        >
          <Edit className="w-4 h-4" />
          Edit Profile
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-medium text-orange-800">{profile?.name || 'User'}</p>
            <p className="text-sm text-orange-600">Customer</p>
          </div>
          
          <Avatar className="w-10 h-10">
            <AvatarImage src={profile?.profile_image_url || undefined} />
            <AvatarFallback className="bg-orange-100 text-orange-800 font-semibold">
              {profile?.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <Button
          onClick={onLogout}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-red-200 text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
