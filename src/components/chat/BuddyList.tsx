
import { User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Buddy {
  id: number;
  name: string;
  avatar: string;
  online: boolean;
  status: string;
}

interface BuddyListProps {
  buddies: Buddy[];
  statusEmojis: Record<string, string>;
}

export const BuddyList = ({ buddies, statusEmojis }: BuddyListProps) => {
  return (
    <div className="mt-4">
      <h3 className="font-bold text-sm flex items-center gap-1 mb-2">
        <User className="h-4 w-4" /> Buddies
      </h3>
      <div className="space-y-1.5 max-h-[30vh] overflow-y-auto pr-1">
        {buddies.map((user) => (
          <div key={user.id} className="flex items-center gap-1.5">
            <div className="relative flex-shrink-0">
              <Avatar className="h-6 w-6">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className={`absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full ${
                user.online ? "bg-green-500" : "bg-gray-300"
              }`} />
            </div>
            <span className="text-xs truncate">{user.name}</span>
            <span className="text-muted-foreground ml-auto text-xs">{statusEmojis[user.status]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
