
import { useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Send } from "lucide-react";
import { ChatMessage } from "./ChatMessage";

interface Message {
  id: number;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
  text: string;
  encrypted: boolean;
  encryptedText?: string;
  timestamp: Date;
  isCurrentUser: boolean;
}

interface Room {
  id: number;
  name: string;
  description: string;
  encrypted: boolean;
}

interface ChatMessageAreaProps {
  selectedRoom: number | null;
  messages: Message[];
  messageText: string;
  rooms: Room[];
  getDisplayText: (message: Message) => string;
  onMessageChange: (text: string) => void;
  onSendMessage: () => void;
}

export const ChatMessageArea = ({
  selectedRoom,
  messages,
  messageText,
  rooms,
  getDisplayText,
  onMessageChange,
  onSendMessage
}: ChatMessageAreaProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const currentRoom = rooms.find(r => r.id === selectedRoom);

  return (
    <>
      <div className="border-b border-border p-2 bg-muted/30">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm">
              {currentRoom?.name}
              {currentRoom?.encrypted && (
                <Badge variant="outline" className="ml-2 flex items-center gap-1 text-xs">
                  <Lock className="h-3 w-3" />
                  <span>Encrypted</span>
                </Badge>
              )}
            </h3>
            <p className="text-xs text-muted-foreground">
              {currentRoom?.description}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/90">
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            displayText={getDisplayText(message)} 
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-border p-2">
        <div className="flex gap-2">
          <Input
            value={messageText}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder={`Type your ${currentRoom?.encrypted ? 'encrypted ' : ''}message...`}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
            className="flex-1"
          />
          <Button onClick={onSendMessage}>
            <Send className="h-4 w-4 mr-1" />
            Send
          </Button>
        </div>
      </div>
    </>
  );
};
