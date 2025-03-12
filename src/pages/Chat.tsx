
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Send, PlusCircle, Users } from "lucide-react";

// Mock data - in a real app this would come from an API
const MOCK_ROOMS = [
  { id: 1, name: "General Chat", description: "Open discussion for everyone" },
  { id: 2, name: "Music Lovers", description: "Share and discuss your favorite music" },
  { id: 3, name: "Book Club", description: "For avid readers and book enthusiasts" },
  { id: 4, name: "Tech Talk", description: "Discussions about technology and gadgets" },
  { id: 5, name: "Movie Buffs", description: "For film enthusiasts and critics" }
];

const MOCK_USERS = [
  { id: 1, name: "Alex Thompson", avatar: "/placeholder.svg", online: true },
  { id: 2, name: "Jamie Lee", avatar: "/placeholder.svg", online: true },
  { id: 3, name: "Sam Rodriguez", avatar: "/placeholder.svg", online: false },
  { id: 4, name: "Casey Kim", avatar: "/placeholder.svg", online: true },
  { id: 5, name: "Taylor Wong", avatar: "/placeholder.svg", online: false }
];

interface Message {
  id: number;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
  text: string;
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
  
  return baseMessages.map((msg, index) => ({
    id: index,
    user: msg.user,
    text: msg.text,
    timestamp: new Date(Date.now() - (baseMessages.length - index) * 1000 * 60 * Math.random() * 10),
    isCurrentUser: msg.user.id === 1 // Assuming user 1 is the current user
  }));
};

const Chat = () => {
  const { toast } = useToast();
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [showUsersList, setShowUsersList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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
  
  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    const newMessage: Message = {
      id: messages.length + 1,
      user: MOCK_USERS[0], // Current user
      text: messageText,
      timestamp: new Date(),
      isCurrentUser: true
    };
    
    setMessages([...messages, newMessage]);
    setMessageText("");
  };
  
  const handleCreateRoom = (roomName: string, roomDescription: string) => {
    toast({
      title: "Room created",
      description: `Your new room "${roomName}" has been created.`
    });
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
                        <Input id="roomName" placeholder="Enter room name" />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="roomDescription">Description</label>
                        <Textarea id="roomDescription" placeholder="Describe this room's purpose" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => handleCreateRoom("New Room", "Description")}>Create Room</Button>
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
                    onClick={() => setSelectedRoom(room.id)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{room.name}</div>
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
                    <div>
                      <CardTitle>
                        {MOCK_ROOMS.find(r => r.id === selectedRoom)?.name}
                      </CardTitle>
                      <CardDescription>
                        {MOCK_ROOMS.find(r => r.id === selectedRoom)?.description}
                      </CardDescription>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setShowUsersList(!showUsersList)}
                    >
                      <Users className="h-5 w-5" />
                    </Button>
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
                              <span className={`text-xs ${message.isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                {message.user.name} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <p>{message.text}</p>
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
                            <div className="text-sm">{user.name}</div>
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
                      placeholder="Type your message..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
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
