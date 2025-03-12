
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
    <div className="container mx-auto px-4 py-12 md:py-24 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">Connect, Share, Grow</h1>
      <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
        Join our community platform where you can connect with like-minded people, share your interests, and build meaningful relationships.
      </p>
      
      <div className="max-w-md mx-auto mb-16">
        <div className="flex gap-2">
          <Input 
            type="email" 
            placeholder="Enter your email to get started" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12"
          />
          <Button 
            onClick={handleGetStarted} 
            size="lg"
            className="px-8"
          >
            Join Now
          </Button>
        </div>
      </div>
    </div>
  );
};
