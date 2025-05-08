
import { Settings, BellOff, User } from "lucide-react";
import { UserProfileCard } from "./UserProfileCard";
import { ChatRoomList } from "./ChatRoomList";
import { BuddyList } from "./BuddyList";

interface Room {
  id: number;
  name: string;
  description: string;
  encrypted: boolean;
}

interface Buddy {
  id: number;
  name: string;
  avatar: string;
  online: boolean;
  status: string;
}

interface ChatSidebarProps {
  userProfile: any;
  userStatus: string;
  awayMessage: string;
  rooms: Room[];
  selectedRoom: number | null;
  buddies: Buddy[];
  statusEmojis: Record<string, string>;
  onAwayMessageChange: (message: string) => void;
  onRoomSelect: (roomId: number) => void;
  onCreateRoomClick: () => void;
  onLogout: () => void;
}

export const ChatSidebar = ({
  userProfile,
  userStatus,
  awayMessage,
  rooms,
  selectedRoom,
  buddies,
  statusEmojis,
  onAwayMessageChange,
  onRoomSelect,
  onCreateRoomClick,
  onLogout
}: ChatSidebarProps) => {
  return (
    <div className="md:w-64 border-r border-border">
      <UserProfileCard 
        userProfile={userProfile}
        userStatus={userStatus}
        awayMessage={awayMessage}
        onAwayMessageChange={onAwayMessageChange}
      />
      
      <div className="p-2">
        <ChatRoomList
          rooms={rooms}
          selectedRoom={selectedRoom}
          onRoomSelect={onRoomSelect}
          onCreateRoomClick={onCreateRoomClick}
        />
        
        <BuddyList buddies={buddies} statusEmojis={statusEmojis} />
        
        <div className="mt-4 space-y-1">
          <button onClick={() => {}} className="flex items-center gap-1.5 w-full text-left text-xs p-1.5 rounded hover:bg-muted/50">
            <Settings className="h-3 w-3" /> Preferences
          </button>
          <button onClick={() => {}} className="flex items-center gap-1.5 w-full text-left text-xs p-1.5 rounded hover:bg-muted/50">
            <BellOff className="h-3 w-3" /> Notification Settings
          </button>
          <button onClick={onLogout} className="flex items-center gap-1.5 w-full text-left text-xs p-1.5 rounded hover:bg-muted/50">
            <User className="h-3 w-3" /> Change Profile
          </button>
        </div>
      </div>
    </div>
  );
};
