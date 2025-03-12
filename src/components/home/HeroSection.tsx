
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export const HeroSection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  
  const handleGetStarted = () => {
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email to get started",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Welcome!",
      description: "Your journey begins now. Explore our platform.",
    });
    
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 py-24 relative">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold neon-glow bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
          Connect in Cyberspace
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Join our next-gen platform where digital connections become reality
        </p>
        
        <div className="max-w-md mx-auto neon-border rounded-lg p-1 bg-background/50 backdrop-blur">
          <div className="flex gap-2">
            <Input 
              type="email" 
              placeholder="Enter your email to get started" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-background/50 border-primary/50"
            />
            <Button 
              onClick={handleGetStarted} 
              size="lg"
              className="px-8 bg-primary hover:bg-primary/80 text-primary-foreground neon-glow"
            >
              Join Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
