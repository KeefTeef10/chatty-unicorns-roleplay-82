
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { ChatWindowHeader } from "@/components/chat/ChatWindowHeader";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatMessageArea } from "@/components/chat/ChatMessageArea";
import { CreateRoomDialog } from "@/components/chat/CreateRoomDialog";
import { EmptyChatState } from "@/components/chat/EmptyChatState";
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

const Chat = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [createRoomData, setCreateRoomData] = useState({
    name: "",
    description: "",
    encrypted: false
  });
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userStatus, setUserStatus] = useState("online");
  const [awayMessage, setAwayMessage] = useState("I'm away from my computer right now.");
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
    const audio = new Audio("data:audio/wav;base64,UklGRnQGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YU8GAACA/4D/gP+A/4X/if+Q/5j/oP+o/67/s/+3/7z/vv/B/8T/x//J/8z/0f/V/9r/4f/p//L/+v8DAAoAFQAcACYALwA6AEMASwBVAF0AZQBqAG8AcwB2AHgAfAB9AH8AgACFAIcAiwCMAI8AkACTAJYAmACbAJ8AoQCjAKUApwCpAKsArACvALEAswC0ALUAtQC2ALcAuQC6ALwAvQC9AL0AvQC7ALsAugC5ALgAuAC3ALEArQCrAKcAogCeAJwAmACTAI8AiwCGAIIAfgB6AHQAcABsAGcAYQBcAFYATwBKAEMAPQA2AC8AKQAhABoAEwALAAUAAAAA+v/y/+z/5f/f/9j/0v/L/8X/vv+4/7H/q/+l/6D/m/+W/5D/jP+I/4P/f/97/3j/df9y/3D/b/9t/2v/a/9q/2r/af9p/2n/af9p/2n/af9p/2r/a/9r/2v/av9s/23/b/9v/3H/cf9y/3P/c/90/3X/df92/3b/d/94/3j/d/94/3j/ef95/3j/eP94/3j/d/93/3b/df91/3T/c/90/3L/cf9x/3H/cP9v/2//b/9u/27/bv9u/27/bv9t/23/bv9u/23/bv9v/27/b/9v/2//cP9w/3H/cv9z/3P/dP91/3f/eP95/3v/fP9+/4D/gf+E/4b/iP+K/43/j/+S/5X/mP+b/57/of+l/6j/q/+v/7L/tf+5/73/wf/E/8n/zP/Q/9T/2P/b/+D/4//n/+v/7v/y//X/+P/7////AgAFAAgACwAOABEAFAAWABgAGwAcAB8AIAAhACMAJAAkACUAJgAlACUAJAAkACMAIgAhAB8AHQAbABgAFwATABAADAAIAAUAAgD+//v/9//z//D/7P/p/+X/4v/e/9v/2P/U/9H/zv/L/8j/xf/C/7//vP+6/7f/tf+z/7H/r/+v/6z/rP+q/6n/qf+p/6j/qP+o/6j/qP+p/6n/qf+q/6v/rP+t/67/sP+x/7L/tP+2/7f/uf+7/73/vv/A/8L/xP/G/8f/yP/J/8r/yv/L/8z/zP/M/8z/zf/N/83/zf/N/83/zv/N/83/zf/N/83/zf/N/8z/zP/M/8z/zf/N/83/zf/N/83/zf/N/83/zv/O/87/z//P/8//z//P/8//0P/Q/9D/0P/Q/9D/0P/Q/9D/0P/Q/9D/0P/Q/9D/0f/Q/9D/0P/Q/9D/0P/Q/9D/0P/Q/9D/0P/P/8//z//O/87/zf/N/8z/y//L/8r/yf/I/8j/x//G/8X/xP/D/8P/wv/A/8D/v/++/7z/vP+7/7r/uf+4/7j/t/+2/7X/tP+z/7L/sv+x/7D/r/+u/67/rf+s/6v/q/+q/6n/qf+o/6j/p/+m/6b/pf+l/6T/o/+j/6L/of+h/6D/n/+f/57/nv+d/53/nP+c/5v/m/+a/5r/mv+Z/5n/mP+Y/5j/l/+X/5f/l/+W/5b/lv+W/5b/lv+W/5b/lv+W/5b/lv+W/5b/l/+X/5j/mP+Y/5n/mv+a/5v/nP+d/53/nv+f/6D/of+i/6P/pP+l/6b/p/+o/6n/qv+r/6v/rP+t/67/r/+w/7H/sf+y/7L/s/+z/7P/s/+z/7P/s/+z/7P/s/+z/7P/s/+z/7P/s/+z/7P/s/+z/7P/s/+z/7P/s/+z/7P/s/+z/7P/s/+z/7P/s/+z/7P/s/+z/7P/s/+z/7P/s/+z/7P/");
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
          <ChatWindowHeader
            title="CyberChat 2.0"
            onMinimize={() => {}}
            onMaximize={() => {}}
            onClose={() => navigate("/")}
          />
          
          <div className="flex flex-col md:flex-row h-[calc(100vh-10rem)]">
            {/* Buddy List - AOL Style */}
            <ChatSidebar
              userProfile={userProfile}
              userStatus={userStatus}
              awayMessage={awayMessage}
              rooms={MOCK_ROOMS}
              selectedRoom={selectedRoom}
              buddies={MOCK_USERS}
              statusEmojis={STATUS_EMOJIS}
              onAwayMessageChange={setAwayMessage}
              onRoomSelect={handleRoomSelect}
              onCreateRoomClick={() => {}}
              onLogout={handleLogout}
            />
            
            {/* Chat Area - AOL Style */}
            <div className="flex-1 flex flex-col">
              {selectedRoom ? (
                <ChatMessageArea
                  selectedRoom={selectedRoom}
                  messages={messages}
                  messageText={messageText}
                  rooms={MOCK_ROOMS}
                  getDisplayText={getDisplayText}
                  onMessageChange={setMessageText}
                  onSendMessage={handleSendMessage}
                />
              ) : (
                <EmptyChatState onJoinGeneralChat={() => handleRoomSelect(1)} />
              )}
            </div>
          </div>
        </div>

        {/* Room Creation Dialog */}
        <CreateRoomDialog
          createRoomData={createRoomData}
          onCreateRoomDataChange={setCreateRoomData}
          onCreateRoom={handleCreateRoom}
        >
          <span></span>
        </CreateRoomDialog>
      </div>
    </div>
  );
};

export default Chat;
