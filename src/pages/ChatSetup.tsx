
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, User, Users, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { generateKeyPair, storeKeys } from "@/utils/encryption";

const AVATARS = [
  "😎", "🤖", "👾", "🦄", "🐱", "🐼", "🦊", "🦁"
];

const ChatSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [status, setStatus] = useState("online");
  
  const handleCreateProfile = () => {
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username to continue",
        variant: "destructive",
      });
      return;
    }
    
    // Generate encryption keys for the user
    const userId = Date.now(); // In a real app, this would be a proper user ID
    const keys = generateKeyPair();
    storeKeys(userId, keys);
    
    // Store profile in localStorage
    const profile = {
      id: userId,
      username,
      avatar: selectedAvatar,
      status,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem("chat_profile", JSON.stringify(profile));
    
    toast({
      title: "Profile created!",
      description: "Welcome to CyberChat! Your secure profile has been created.",
    });
    
    navigate("/chat");
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card className="border-2 border-primary shadow-lg">
            <div className="bg-primary text-primary-foreground p-2 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="font-bold">CyberChat 2.0 - Create Profile</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 bg-muted rounded-full cursor-pointer hover:bg-muted/80"></div>
                <div className="h-3 w-3 bg-secondary rounded-full cursor-pointer hover:bg-secondary/80"></div>
                <div className="h-3 w-3 bg-accent rounded-full cursor-pointer hover:bg-accent/80"></div>
              </div>
            </div>
            
            <CardHeader>
              <CardTitle className="text-center text-2xl">Create Your Chat Profile</CardTitle>
              <CardDescription className="text-center">
                Set up your profile to start chatting securely
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" /> 
                  Screen Name
                </label>
                <Input
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-2"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Avatar</label>
                <div className="grid grid-cols-4 gap-2">
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`text-2xl p-2 rounded-md flex items-center justify-center ${
                        selectedAvatar === avatar ? "bg-primary/20 border-2 border-primary" : "bg-muted/50"
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setStatus("online")}
                    className={`p-2 rounded-md flex items-center justify-center gap-1 ${
                      status === "online" ? "bg-primary/20 border-2 border-primary" : "bg-muted/50"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Online
                  </button>
                  <button
                    onClick={() => setStatus("away")}
                    className={`p-2 rounded-md flex items-center justify-center gap-1 ${
                      status === "away" ? "bg-primary/20 border-2 border-primary" : "bg-muted/50"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                    Away
                  </button>
                </div>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-md border border-border">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <div className="text-sm">
                    <p className="font-medium">Secure & Encrypted</p>
                    <p className="text-muted-foreground text-xs">
                      All your chats will be protected with end-to-end encryption.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button onClick={handleCreateProfile} className="w-full">
                Create Profile & Start Chatting
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatSetup;
