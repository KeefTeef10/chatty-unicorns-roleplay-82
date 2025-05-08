
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Send, PlusCircle, Users, Shield, Lock, LockOpen } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  generateKeyPair, 
  generateSymmetricKey, 
  encryptSymmetric, 
  decryptSymmetric, 
  storeKeys, 
  getKeys,
  storeRoomKey,
  getRoomKey
} from "@/utils/encryption";

// Mock data - in a real app this would come from an API
const MOCK_ROOMS = [
  { id: 1, name: "General Chat", description: "Open discussion for everyone", encrypted: false },
  { id: 2, name: "Music Lovers", description: "Share and discuss your favorite music", encrypted: false },
  { id: 3, name: "Book Club", description: "For avid readers and book enthusiasts", encrypted: true },
  { id: 4, name: "Tech Talk", description: "Discussions about technology and gadgets", encrypted: false },
  { id: 5, name: "Secure Room", description: "End-to-end encrypted communications", encrypted: true }
];

const MOCK_USERS = [
  { id: 1, name: "Alex Thompson", avatar: "/placeholder.svg", online: true, publicKey: "mock-public-key-1" },
  { id: 2, name: "Jamie Lee", avatar: "/placeholder.svg", online: true, publicKey: "mock-public-key-2" },
  { id: 3, name: "Sam Rodriguez", avatar: "/placeholder.svg", online: false, publicKey: "mock-public-key-3" },
  { id: 4, name: "Casey Kim", avatar: "/placeholder.svg", online: true, publicKey: "mock-public-key-4" },
  { id: 5, name: "Taylor Wong", avatar: "/placeholder.svg", online: false, publicKey: "mock-public-key-5" }
];

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

// Generate mock messages for demonstration
const generateMockMessages = (roomId: number): Message[] => {
  const baseMessages = [
    { text: "Hey everyone! How's it going?", user: MOCK_USERS[0] },
    { text: "I'm doing great, thanks for asking!", user: MOCK_USERS[1] },
    { text: "Has anyone seen the new movie that just came out?", user: MOCK_USERS[2] },
    { text: "Yes, I watched it last weekend. It was amazing!", user: MOCK_USERS[3] },
    { text: "I've been meaning to check it out. Is it worth seeing in theaters?", user: MOCK_USERS[4] }
  ];
  
  const room = MOCK_ROOMS.find(r => r.id === roomId);
  const isEncrypted = room?.encrypted || false;
  
  return baseMessages.map((msg, index) => {
    let message: Message = {
      id: index,
      user: msg.user,
      text: msg.text,
      encrypted: isEncrypted,
      timestamp: new Date(Date.now() - (baseMessages.length - index) * 1000 * 60 * Math.random() * 10),
      isCurrentUser: msg.user.id === 1 // Assuming user 1 is the current user
    };
    
    // If room is encrypted, add mock encrypted text
    if (isEncrypted) {
      const key = getRoomKey(roomId) || generateAndStoreRoomKey(roomId);
      message.encryptedText = encryptSymmetric(msg.text, key);
    }
    
    return message;
  });
};

// Helper function to generate and store a room key if it doesn't exist
const generateAndStoreRoomKey = (roomId: number) => {
  const key = generateSymmetricKey();
  storeRoomKey(roomId, key);
  return key;
};

const Chat = () => {
  const { toast } = useToast();
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [showUsersList, setShowUsersList] = useState(false);
  const [createRoomData, setCreateRoomData] = useState({
    name: "",
    description: "",
    encrypted: false
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentUserId] = useState(1); // In a real app, this would come from authentication
  const [userKeys, setUserKeys] = useState<{ publicKey: string; secretKey: string } | null>(null);
  
  // Initialize user keys
  useEffect(() => {
    let keys = getKeys(currentUserId);
    
    if (!keys) {
      keys = generateKeyPair();
      storeKeys(currentUserId, keys);
    }
    
    setUserKeys(keys);
  }, [currentUserId]);
  
  // Load messages when room changes
  useEffect(() => {
    if (selectedRoom !== null) {
      setMessages(generateMockMessages(selectedRoom));
    }
  }, [selectedRoom]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleRoomSelect = (roomId: number) => {
    setSelectedRoom(roomId);
    const room = MOCK_ROOMS.find(r => r.id === roomId);
    
    // If room is encrypted and we don't have a key for it, generate one
    if (room?.encrypted && !getRoomKey(roomId)) {
      generateAndStoreRoomKey(roomId);
      toast({
        title: "Secure Room",
        description: "You've joined an encrypted room. Messages are protected with end-to-end encryption."
      });
    }
  };
  
  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    const room = MOCK_ROOMS.find(r => r.id === selectedRoom);
    const isEncrypted = room?.encrypted || false;
    
    let encryptedText: string | undefined = undefined;
    
    // Encrypt message if the room is encrypted
    if (isEncrypted) {
      const key = getRoomKey(selectedRoom!);
      if (key) {
        encryptedText = encryptSymmetric(messageText, key);
      } else {
        toast({
          title: "Encryption Error",
          description: "Could not encrypt your message. Room key not found."
        });
        return;
      }
    }
    
    const newMessage: Message = {
      id: messages.length + 1,
      user: MOCK_USERS[0], // Current user
      text: messageText,
      encrypted: isEncrypted,
      encryptedText,
      timestamp: new Date(),
      isCurrentUser: true
    };
    
    setMessages([...messages, newMessage]);
    setMessageText("");
  };
  
  const handleCreateRoom = () => {
    if (!createRoomData.name.trim()) {
      toast({
        title: "Error",
        description: "Room name is required"
      });
      return;
    }
    
    const newRoom = {
      id: MOCK_ROOMS.length + 1,
      name: createRoomData.name,
      description: createRoomData.description,
      encrypted: createRoomData.encrypted
    };
    
    // In a real app, this would be sent to the server
    // For now, just show a toast and reset the form
    
    if (createRoomData.encrypted) {
      // Generate a symmetric key for this room
      generateAndStoreRoomKey(newRoom.id);
    }
    
    toast({
      title: "Room created",
      description: `Your new ${createRoomData.encrypted ? 'encrypted ' : ''}room "${createRoomData.name}" has been created.`
    });
    
    setCreateRoomData({ name: "", description: "", encrypted: false });
  };

  // Function to decrypt a message if needed
  const getDisplayText = (message: Message) => {
    if (!message.encrypted) {
      return message.text;
    }
    
    // If we're showing an encrypted message
    try {
      const key = getRoomKey(selectedRoom!);
      if (key && message.encryptedText) {
        return decryptSymmetric(message.encryptedText, key);
      }
      return "Encrypted message (key not available)";
    } catch (error) {
      return "Could not decrypt message";
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sidebar - Rooms list */}
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle>Chat Rooms</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <PlusCircle className="h-5 w-5" />
                    </Button>
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
                          onChange={(e) => setCreateRoomData({ ...createRoomData, name: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="roomDescription">Description</label>
                        <Textarea 
                          id="roomDescription" 
                          placeholder="Describe this room's purpose"
                          value={createRoomData.description}
                          onChange={(e) => setCreateRoomData({ ...createRoomData, description: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="encrypted"
                          checked={createRoomData.encrypted}
                          onCheckedChange={(checked) => setCreateRoomData({ ...createRoomData, encrypted: checked })}
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
                      <Button onClick={handleCreateRoom}>Create Room</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription>
                Join a room to start chatting
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[calc(100vh-16rem)]">
              <div className="grid gap-2">
                {MOCK_ROOMS.map((room) => (
                  <Button
                    key={room.id}
                    variant={selectedRoom === room.id ? "default" : "ghost"}
                    className="justify-start h-auto py-3 px-4"
                    onClick={() => handleRoomSelect(room.id)}
                  >
                    <div className="text-left w-full">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{room.name}</div>
                        {room.encrypted && <Lock className="h-3 w-3 text-primary" />}
                      </div>
                      <div className="text-xs text-muted-foreground">{room.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Chat Area */}
        <div className="md:col-span-3 flex flex-col">
          <Card className="flex-1 flex flex-col h-[calc(100vh-10rem)]">
            {selectedRoom ? (
              <>
                <CardHeader className="pb-4 flex-shrink-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div>
                        <CardTitle>
                          {MOCK_ROOMS.find(r => r.id === selectedRoom)?.name}
                        </CardTitle>
                        <CardDescription>
                          {MOCK_ROOMS.find(r => r.id === selectedRoom)?.description}
                        </CardDescription>
                      </div>
                      {MOCK_ROOMS.find(r => r.id === selectedRoom)?.encrypted && (
                        <Badge variant="outline" className="ml-2 flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          <span>Encrypted</span>
                        </Badge>
                      )}
                    </div>
                    <ToggleGroup type="single" value={showUsersList ? "users" : "chat"}>
                      <ToggleGroupItem value="chat" onClick={() => setShowUsersList(false)}>
                        Chat
                      </ToggleGroupItem>
                      <ToggleGroupItem value="users" onClick={() => setShowUsersList(true)}>
                        <Users className="h-4 w-4 mr-1" />
                        Users
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-y-auto p-4 flex">
                  {/* Messages */}
                  <div className="flex-1 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`flex max-w-[80%] ${message.isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={message.user.avatar} alt={message.user.name} />
                            <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className={`rounded-lg px-4 py-2 ${
                            message.isCurrentUser 
                              ? "bg-primary text-primary-foreground ml-2" 
                              : "bg-muted mr-2"
                          }`}
                          >
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1">
                                <span className={`text-xs ${message.isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                  {message.user.name} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {message.encrypted && (
                                  <Lock className={`h-3 w-3 ${message.isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"}`} />
                                )}
                              </div>
                              <p>{getDisplayText(message)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* Users list sidebar - show only when showUsersList is true */}
                  {showUsersList && (
                    <div className="w-64 ml-4 border-l pl-4 hidden md:block">
                      <h3 className="font-medium mb-2">Online Users</h3>
                      <div className="space-y-3">
                        {MOCK_USERS.map((user) => (
                          <div key={user.id} className="flex items-center">
                            <div className="relative">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className={`absolute bottom-0 right-1 h-2 w-2 rounded-full ${
                                user.online ? "bg-green-500" : "bg-gray-300"
                              }`} />
                            </div>
                            <div className="text-sm flex items-center gap-1">
                              {user.name}
                              {MOCK_ROOMS.find(r => r.id === selectedRoom)?.encrypted && (
                                <Lock className="h-3 w-3 text-muted-foreground" title="Has encryption keys" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="p-4 flex-shrink-0">
                  <div className="flex w-full space-x-2">
                    <Input
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder={`Type your ${MOCK_ROOMS.find(r => r.id === selectedRoom)?.encrypted ? 'encrypted ' : ''}message...`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4 mr-1" />
                      Send
                    </Button>
                  </div>
                </CardFooter>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-4">
                  <h2 className="text-xl font-semibold mb-2">Select a Chat Room</h2>
                  <p className="text-muted-foreground">Choose a room from the sidebar to start chatting</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;
