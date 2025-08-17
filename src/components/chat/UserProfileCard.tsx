
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { UserProfile } from "@/types/chat";

interface UserProfileCardProps {
  userProfile: UserProfile | null;
  userStatus: string;
  awayMessage: string;
  onAwayMessageChange: (message: string) => void;
}

export const UserProfileCard = ({ 
  userProfile, 
  userStatus, 
  awayMessage, 
  onAwayMessageChange 
}: UserProfileCardProps) => {
  return (
    <div className="border-b border-border p-2">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-shrink-0">
          {userProfile?.avatar ? (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">
              {userProfile.avatar}
            </div>
          ) : (
            <Avatar>
              <AvatarFallback>{userProfile?.username?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          )}
        </div>
        <div className="overflow-hidden">
          <p className="font-bold truncate">{userProfile?.username || "User"}</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
            <span>{userStatus}</span>
          </div>
        </div>
      </div>
      
      {userStatus === "away" && (
        <div className="text-xs bg-muted/30 p-2 rounded">
          <p className="font-bold">Away Message:</p>
          <p className="text-muted-foreground">{awayMessage}</p>
          <Input 
            value={awayMessage}
            onChange={(e) => onAwayMessageChange(e.target.value)}
            className="mt-1 h-6 text-xs"
            placeholder="Set away message..."
          />
        </div>
      )}
    </div>
  );
};
