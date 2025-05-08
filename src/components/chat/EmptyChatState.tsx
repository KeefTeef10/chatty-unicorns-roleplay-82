
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface EmptyChatStateProps {
  onJoinGeneralChat: () => void;
}

export const EmptyChatState = ({ onJoinGeneralChat }: EmptyChatStateProps) => {
  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-muted/10">
      <div className="text-center">
        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h2 className="text-xl font-bold mb-2">Select a Chat Room</h2>
        <p className="text-muted-foreground">Choose a room from the buddy list to start chatting</p>
        <div className="mt-6">
          <Button onClick={onJoinGeneralChat} size="sm">
            Join General Chat
          </Button>
        </div>
      </div>
    </div>
  );
};
