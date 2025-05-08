
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ShieldCheck, Users, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export const ChatTab = () => {
  const navigate = useNavigate();
  
  const handleExploreChat = () => {
    navigate("/chat-setup");
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Safe Chat Platform</CardTitle>
          <Badge variant="secondary" className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            <span>End-to-End Encrypted</span>
          </Badge>
        </div>
        <CardDescription>Engage in secure, encrypted conversations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>Our chat platform is designed with privacy and security in mind. All conversations are end-to-end encrypted, ensuring that only you and your intended recipients can read your messages.</p>
          
          {/* Chat Window Preview */}
          <div className="border-2 border-primary rounded-md overflow-hidden bg-card shadow-lg">
            <div className="bg-primary text-primary-foreground p-2 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="font-bold text-sm">CyberChat 2.0</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 bg-muted rounded-full cursor-pointer hover:bg-muted/80"></div>
                <div className="h-3 w-3 bg-secondary rounded-full cursor-pointer hover:bg-secondary/80"></div>
                <div className="h-3 w-3 bg-accent rounded-full cursor-pointer hover:bg-accent/80"></div>
              </div>
            </div>
            <div className="h-40 bg-background p-3 overflow-hidden relative">
              <div className="flex gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">CU</div>
                <div className="bg-secondary/20 p-2 rounded-lg text-sm max-w-[70%]">
                  <p className="text-xs text-muted-foreground mb-1">CyberUser (Online)</p>
                  <p>Hey there! Welcome to CyberChat 2.0</p>
                </div>
              </div>
              <div className="flex gap-2 justify-end mb-2">
                <div className="bg-primary/20 p-2 rounded-lg text-sm max-w-[70%]">
                  <p className="text-xs text-muted-foreground mb-1">You (Online)</p>
                  <p>Thanks! Loving the retro AOL style!</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold">ME</div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent h-16"></div>
            </div>
            <div className="border-t border-border p-2 flex gap-2">
              <div className="flex-1 h-8 rounded bg-muted"></div>
              <Button size="sm" className="h-8 py-0 px-3">Send</Button>
            </div>
          </div>
          
          <div className="bg-muted p-3 rounded-md border border-border">
            <div className="flex items-start gap-2 mb-3">
              <div className="bg-primary/20 p-2 rounded-md">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div className="text-sm">
                <p className="font-medium">End-to-End Encryption</p>
                <p className="text-muted-foreground">Your messages are encrypted on your device and can only be decrypted by the intended recipients.</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleExploreChat} className="w-full">
          <MessageSquare className="h-4 w-4 mr-2" />
          Start Chatting Now
        </Button>
      </CardFooter>
    </Card>
  );
};
