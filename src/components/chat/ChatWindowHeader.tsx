
import { MessageSquare, Minimize, Maximize, X } from "lucide-react";

interface ChatWindowHeaderProps {
  title: string;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
}

export const ChatWindowHeader = ({
  title,
  onMinimize,
  onMaximize,
  onClose
}: ChatWindowHeaderProps) => {
  return (
    <div className="bg-primary text-primary-foreground p-2 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        <span className="font-bold text-sm">{title}</span>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={onMinimize} className="h-3 w-3 bg-muted rounded-full hover:bg-muted/80 flex items-center justify-center">
          <Minimize className="h-2 w-2" />
        </button>
        <button onClick={onMaximize} className="h-3 w-3 bg-secondary rounded-full hover:bg-secondary/80 flex items-center justify-center">
          <Maximize className="h-2 w-2" />
        </button>
        <button onClick={onClose} className="h-3 w-3 bg-accent rounded-full hover:bg-accent/80 flex items-center justify-center">
          <X className="h-2 w-2" />
        </button>
      </div>
    </div>
  );
};
