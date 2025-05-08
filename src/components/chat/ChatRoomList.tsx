
import { PlusCircle, Users, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Room {
  id: number;
  name: string;
  description: string;
  encrypted: boolean;
}

interface ChatRoomListProps {
  rooms: Room[];
  selectedRoom: number | null;
  onRoomSelect: (roomId: number) => void;
  onCreateRoomClick: () => void;
}

export const ChatRoomList = ({
  rooms,
  selectedRoom,
  onRoomSelect,
  onCreateRoomClick
}: ChatRoomListProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-sm flex items-center gap-1">
          <Users className="h-4 w-4" /> Chat Rooms
        </h3>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onCreateRoomClick}>
          <PlusCircle className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="space-y-1 max-h-[30vh] overflow-y-auto pr-1">
        {rooms.map((room) => (
          <button
            key={room.id}
            className={`w-full text-left text-sm p-1.5 rounded ${
              selectedRoom === room.id 
                ? "bg-primary/20 font-medium" 
                : "hover:bg-muted/50"
            }`}
            onClick={() => onRoomSelect(room.id)}
          >
            <div className="flex items-center justify-between">
              <span className="truncate">{room.name}</span>
              {room.encrypted && <Lock className="h-3 w-3 text-primary" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
