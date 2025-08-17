
import { Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

interface CreateRoomData {
  name: string;
  description: string;
  encrypted: boolean;
}

interface CreateRoomDialogProps {
  createRoomData: CreateRoomData;
  onCreateRoomDataChange: (data: CreateRoomData) => void;
  onCreateRoom: () => void;
  children: React.ReactNode;
}

export const CreateRoomDialog = ({
  createRoomData,
  onCreateRoomDataChange,
  onCreateRoom,
  children
}: CreateRoomDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
          <DialogDescription>
            Create a new chat room for your interests or community.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="roomName">Room Name</label>
            <Input 
              id="roomName" 
              placeholder="Enter room name"
              value={createRoomData.name}
              onChange={(e) => onCreateRoomDataChange({ 
                ...createRoomData, 
                name: e.target.value 
              })}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="roomDescription">Description</label>
            <Textarea 
              id="roomDescription" 
              placeholder="Describe this room's purpose"
              value={createRoomData.description}
              onChange={(e) => onCreateRoomDataChange({ 
                ...createRoomData, 
                description: e.target.value 
              })}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="encrypted"
              checked={createRoomData.encrypted}
              onCheckedChange={(checked) => onCreateRoomDataChange({ 
                ...createRoomData, 
                encrypted: checked 
              })}
            />
            <label htmlFor="encrypted" className="flex items-center cursor-pointer">
              <Shield className="h-4 w-4 mr-1 text-primary" /> 
              End-to-end encryption
            </label>
          </div>
          {createRoomData.encrypted && (
            <div className="bg-secondary/10 p-3 rounded-md text-xs">
              End-to-end encryption ensures that only members of this room can read messages.
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onCreateRoom}>Create Room</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
