import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Send, PlusCircle, Users, Shield, Lock, LockOpen, User, MessageSquare, X, Minimize, Maximize, BellOff, Settings } from "lucide-react";
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
import { useNavigate } from "react-router-dom";

// Mock data - in a real app this would come from an API
const MOCK_ROOMS = [
  { id: 1, name: "General Chat", description: "Open discussion for everyone", encrypted: false },
  { id: 2, name: "Music Lovers", description: "Share and discuss your favorite music", encrypted: false },
  { id: 3, name: "Book Club", description: "For avid readers and book enthusiasts", encrypted: true },
  { id: 4, name: "Tech Talk", description: "Discussions about technology and gadgets", encrypted: false },
  { id: 5, name: "Secure Room", description: "End-to-end encrypted communications", encrypted: true }
];

const MOCK_USERS = [
  { id: 1, name: "Alex Thompson", avatar: "/placeholder.svg", online: true, publicKey: "mock-public-key-1", status: "online" },
  { id: 2, name: "Jamie Lee", avatar: "/placeholder.svg", online: true, publicKey: "mock-public-key-2", status: "away" },
  { id: 3, name: "Sam Rodriguez", avatar: "/placeholder.svg", online: false, publicKey: "mock-public-key-3", status: "offline" },
  { id: 4, name: "Casey Kim", avatar: "/placeholder.svg", online: true, publicKey: "mock-public-key-4", status: "online" },
  { id: 5, name: "Taylor Wong", avatar: "/placeholder.svg", online: false, publicKey: "mock-public-key-5", status: "offline" }
];

// Status emoji mapping
const STATUS_EMOJIS = {
  online: "🟢",
  away: "🟡",
  offline: "⚫"
};

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

const AOLHeader = ({ title, onMinimize, onMaximize, onClose }) => {
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

const Chat = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [showUsersList, setShowUsersList] = useState(true);
  const [createRoomData, setCreateRoomData] = useState({
    name: "",
    description: "",
    encrypted: false
  });
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userStatus, setUserStatus] = useState("online");
  const [awayMessage, setAwayMessage] = useState("I'm away from my computer right now.");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentUserId] = useState(1); // In a real app, this would come from authentication
  const [userKeys, setUserKeys] = useState<{ publicKey: string; secretKey: string } | null>(null);
  
  // Check if user has created a profile
  useEffect(() => {
    const storedProfile = localStorage.getItem("chat_profile");
    if (!storedProfile) {
      toast({
        title: "Profile required",
        description: "Please create a chat profile to continue",
      });
      navigate("/chat-setup");
      return;
    }
    
    try {
      const profile = JSON.parse(storedProfile);
      setUserProfile(profile);
      setUserStatus(profile.status || "online");
    } catch (error) {
      console.error("Error parsing profile:", error);
      navigate("/chat-setup");
    }
  }, [navigate, toast]);
  
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
      user: {
        id: currentUserId,
        name: userProfile?.username || "Me",
        avatar: "/placeholder.svg"
      },
      text: messageText,
      encrypted: isEncrypted,
      encryptedText,
      timestamp: new Date(),
      isCurrentUser: true
    };
    
    setMessages([...messages, newMessage]);
    setMessageText("");
    
    // Play send sound - AOL style
    const audio = new Audio("data:audio/wav;base64,UklGRnQGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YU8GAACA/4D/gP+A/4X/if+Q/5j/oP+o/67/s/+3/7z/vv/B/8T/x//J/8z/0f/V/9r/4f/p//L/+v8DAAoAFQAcACYALwA6AEMASwBVAF0AZQBqAG8AcwB2AHgAfAB9AH8AgACFAIcAiwCMAI8AkACTAJYAmACbAJ8AoQCjAKUApwCpAKsArACvALEAswC0ALUAtQC2ALcAuQC6ALwAvQC9AL0AvQC7ALsAugC5ALgAuAC3ALEArQCrAKcAogCeAJwAmACTAI8AiwCGAIIAfgB6AHQAcABsAGcAYQBcAFYATwBKAEMAPQA2AC8AKQAhABoAEwALAAUAAAAA+v/y/+z/5f/f/9j/0v/L/8X/vv+4/7H/q/+l/6D/m/+W/5D/jP+I/4P/f/97/3j/df9y/3D/b/9t/2v/a/9q/2r/af9p/2n/af9p/2n/af9q/2r/a/9r/2r/bP9s/23/b/9v/3H/cf9y/3P/c/90/3X/df92/3b/d/94/3j/d/94/3j/ef95/3j/eP94/3j/d/93/3b/df91/3T/c/90/3L/cf9x/3H/cP9v/2//b/9u/27/bv9u/27/bv9t/23/bv9u/23/bv9v/27/b/9v/2//cP9w/3H/cv9z/3P/dP91/3f/eP95/3v/fP9+/4D/gf+E/4b/iP+K/43/j/+S/5X/mP+b/57/of+l/6j/q/+v/7L/tf+5/73/wf/E/8n/zP/Q/9T/2P/b/+D/4//n/+v/7v/y//X/+P/7////AgAFAAgACwAOABEAFAAWABgAGwAcAB8AIAAhACMAJAAkACUAJgAlACUAJAAkACMAIgAhAB8AHQAbABgAFwATABAADAAIAAUAAgD+//v/9//z//D/7P/p/+X/4v/e/9v/2P/U/9H/zv/L/8j/xf/C/7//vP+6/7f/tf+z/7H/r/+v/6z/rP+q/6n/qf+p/6j/qP+o/6j/qP+p/6n/qf+q/6v/rP+t/67/sP+x/7L/tP+2/7f/uf+7/73/vv/A/8L/xP/G/8f/yP/J/8r/yv/L/8z/zP/M/8z/zf/N/83/zf/N/83/zv/N/83/zf/N/83/zf/N/8z/zP/M/8z/zf/N/83/zf/N/83/zf/N/83/zv/O/87/z//P/8//z//P/8//0P/Q/9D/0P/Q/9D/0P/Q/9D/0P/Q/9D/0P/Q/9D/0f/Q/9D/0P/Q/9D/0P/Q/9D/0P/Q/9D/0P/P/8//z//O/87/zf/N/8z/y//L/8r/yf/I/8j/x//G/8X/xP/D/8P/wv/A/8D/v/++/7z/vP+7/7r/uf+4/7j/t/+2/7X/tP+z/7L/sv+x/7D/r/+u/67/rf+s/6v/q/+q/6n/qf+o/6j/p/+m/6b/pf+l/6T/o/+j/6L/of+h/6D/n/+f/57/nv+d/53/nP+c/5v/m/+a/5r/mv+Z/5n/mP+Y/5j/l/+X/5f/l/+W/5b/lv+W/5b/lv+W/5b/lv+W/5b/lv+W/5b/l/+X/5j/mP+Y/5n/mv+a/5v/nP+d/53/nv+f/6D/of+i/6P/pP+l/6b/p/+o/6n/qv+r/6v/rP+t/67/r/+w/7H/sf+y/7L/s/+z/7P/s/+z/7P/s/+z/7P/s/+z/7P/s/+z/7P/s/+z/7P/s/+z/7P/s/+z/7P/s/+z/7P/s/+z/7P/s/+z/7P/s/+z/7P/s/+z/7P/s/+z/7P/s/+z/7P/");
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio play failed:", e));
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
  
  const handleStatusChange = (newStatus: string) => {
    setUserStatus(newStatus);
    
    // Update profile in localStorage
    if (userProfile) {
      const updatedProfile = { ...userProfile, status: newStatus };
      localStorage.setItem("chat_profile", JSON.stringify(updatedProfile));
      setUserProfile(updatedProfile);
    }
    
    toast({
      title: `Status set to ${newStatus}`,
      description: newStatus === "away" ? `Away message: ${awayMessage}` : "You are now online",
    });
  };
  
  const handleLogout = () => {
    navigate("/chat-setup");
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto p-4">
        {/* AOL-style main window */}
        <div className="border-2 border-primary rounded-md overflow-hidden shadow-lg bg-card">
          <AOLHeader 
            title="CyberChat 2.0"
            onMinimize={() => {}}
            onMaximize={() => {}}
            onClose={() => navigate("/")}
          />
          
          <div className="flex flex-col md:flex-row h-[calc(100vh-10rem)]">
            {/* Buddy List - AOL Style */}
            <div className="md:w-64 border-r border-border">
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
                      <select 
                        value={userStatus}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="bg-transparent border-none p-0 text-xs outline-none"
                      >
                        <option value="online">Online</option>
                        <option value="away">Away</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {userStatus === "away" && (
                  <div className="text-xs bg-muted/30 p-2 rounded">
                    <p className="font-bold">Away Message:</p>
                    <p className="text-muted-foreground">{awayMessage}</p>
                    <Input 
                      value={awayMessage}
                      onChange={(e) => setAwayMessage(e.target.value)}
                      className="mt-1 h-6 text-xs"
                      placeholder="Set away message..."
                    />
                  </div>
                )}
              </div>
              
              <div className="p-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm flex items-center gap-1">
                    <Users className="h-4 w-4" /> Chat Rooms
                  </h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5">
                        <PlusCircle className="h-3 w-3" />
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
                
                <div className="space-y-1 max-h-[30vh] overflow-y-auto pr-1">
                  {MOCK_ROOMS.map((room) => (
                    <button
                      key={room.id}
                      className={`w-full text-left text-sm p-1.5 rounded ${
                        selectedRoom === room.id 
                          ? "bg-primary/20 font-medium" 
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => handleRoomSelect(room.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{room.name}</span>
                        {room.encrypted && <Lock className="h-3 w-3 text-primary" />}
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="mt-4">
                  <h3 className="font-bold text-sm flex items-center gap-1 mb-2">
                    <User className="h-4 w-4" /> Buddies
                  </h3>
                  <div className="space-y-1.5 max-h-[30vh] overflow-y-auto pr-1">
                    {MOCK_USERS.map((user) => (
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
                        <span className="text-muted-foreground ml-auto text-xs">{STATUS_EMOJIS[user.status]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 space-y-1">
                  <button onClick={() => {}} className="flex items-center gap-1.5 w-full text-left text-xs p-1.5 rounded hover:bg-muted/50">
                    <Settings className="h-3 w-3" /> Preferences
                  </button>
                  <button onClick={() => {}} className="flex items-center gap-1.5 w-full text-left text-xs p-1.5 rounded hover:bg-muted/50">
                    <BellOff className="h-3 w-3" /> Notification Settings
                  </button>
                  <button onClick={handleLogout} className="flex items-center gap-1.5 w-full text-left text-xs p-1.5 rounded hover:bg-muted/50">
                    <User className="h-3 w-3" /> Change Profile
                  </button>
                </div>
              </div>
            </div>
            
            {/* Chat Area - AOL Style */}
            <div className="flex-1 flex flex-col">
              {selectedRoom ? (
                <>
                  <div className="border-b border-border p-2 bg-muted/30">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-sm">
                          {MOCK_ROOMS.find(r => r.id === selectedRoom)?.name}
                          {MOCK_ROOMS.find(r => r.id === selectedRoom)?.encrypted && (
                            <Badge variant="outline" className="ml-2 flex items-center gap-1 text-xs">
                              <Lock className="h-3 w-3" />
                              <span>Encrypted</span>
                            </Badge>
                          )}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {MOCK_ROOMS.find(r => r.id === selectedRoom)?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/90">
                    {messages.map((message) => (
                      <div
                        key={message.id}
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
                              <p className="mt-1">{getDisplayText(message)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  
                  <div className="border-t border-border p-2">
                    <div className="flex gap-2">
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
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-4 bg-muted/10">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h2 className="text-xl font-bold mb-2">Select a Chat Room</h2>
                    <p className="text-muted-foreground">Choose a room from the buddy list to start chatting</p>
                    <div className="mt-6">
                      <Button onClick={() => handleRoomSelect(1)} size="sm">
                        Join General Chat
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
