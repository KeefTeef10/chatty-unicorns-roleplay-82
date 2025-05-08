
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, User } from "lucide-react";

export const ChatPreview = () => {
  const navigate = useNavigate();
  
  const handleStartChat = () => {
    navigate("/chat-setup");
  };
  
  return (
    <div className="relative max-w-4xl mx-auto mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 neon-glow">Retro-Futuristic Chat Experience</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Experience our AOL-inspired instant messenger with modern encryption and cyberpunk style
        </p>
      </div>
      
      <div className="border-2 border-primary rounded-lg overflow-hidden shadow-lg bg-background/80 backdrop-blur-sm mx-auto max-w-3xl">
        <div className="bg-primary text-primary-foreground p-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="font-bold">CyberChat 2.0</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 bg-muted rounded-full"></div>
            <div className="h-3 w-3 bg-secondary rounded-full"></div>
            <div className="h-3 w-3 bg-accent rounded-full"></div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row">
          <div className="md:w-60 border-r border-border p-4">
            <div className="mb-4">
              <h3 className="text-sm font-bold mb-2 flex items-center gap-1">
                <User className="h-4 w-4" />
                Your Profile
              </h3>
              <div className="bg-muted/20 p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-xl">
                    😎
                  </div>
                  <div>
                    <div className="font-medium">CyberUser</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span className="h-1.5 w-1.5 bg-green-500 rounded-full mr-1"></span> Online
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-bold mb-2 flex items-center gap-1">
                <Users className="h-4 w-4" />
                Buddy List
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <div className="relative">
                    <div className="w-6 h-6 bg-secondary/20 rounded-full"></div>
                    <span className="absolute bottom-0 right-0 h-1.5 w-1.5 bg-green-500 rounded-full"></span>
                  </div>
                  <span className="text-xs">NetRunner42</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="relative">
                    <div className="w-6 h-6 bg-accent/20 rounded-full"></div>
                    <span className="absolute bottom-0 right-0 h-1.5 w-1.5 bg-yellow-500 rounded-full"></span>
                  </div>
                  <span className="text-xs">DigitalNomad</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="relative">
                    <div className="w-6 h-6 bg-primary/20 rounded-full"></div>
                    <span className="absolute bottom-0 right-0 h-1.5 w-1.5 bg-gray-400 rounded-full"></span>
                  </div>
                  <span className="text-xs">CyberSamurai</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-4 flex flex-col">
            <div className="flex-1 mb-4">
              <div className="bg-muted/20 p-3 rounded-md mb-2">
                <p className="text-sm italic text-center">End-to-end encryption enabled. Your messages are secure.</p>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-secondary/20 rounded-full flex-shrink-0"></div>
                  <div className="bg-muted/30 p-2 rounded-lg text-sm max-w-[70%]">
                    <p className="text-xs font-bold mb-1">NetRunner42</p>
                    <p>Hey there! Welcome to CyberChat 2.0!</p>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <div className="bg-primary/20 p-2 rounded-lg text-sm max-w-[70%]">
                    <p className="text-xs font-bold mb-1">You</p>
                    <p>Thanks! This retro AOL style is awesome!</p>
                  </div>
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex-shrink-0"></div>
                </div>
              </div>
            </div>
            <div className="border-t border-border pt-3">
              <Button onClick={handleStartChat} className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Create Profile & Start Chatting
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
