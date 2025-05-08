
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Lock } from "lucide-react";

interface MessageProps {
  id: number;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
  text: string;
  encrypted: boolean;
  timestamp: Date;
  isCurrentUser: boolean;
}

export const ChatMessage = ({ message, displayText }: { message: MessageProps, displayText: string }) => {
  return (
    <div
      className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`flex max-w-[80%] ${message.isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
        <div className="flex-shrink-0">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={message.user.avatar} alt={message.user.name} />
            <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <div className={`rounded-lg px-4 py-2 ${
          message.isCurrentUser 
            ? "bg-primary/20 ml-2" 
            : "bg-muted mr-2"
        }`}
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold">
                {message.user.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              {message.encrypted && (
                <Lock className="h-3 w-3 text-muted-foreground" />
              )}
            </div>
            <p className="mt-1">{displayText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
