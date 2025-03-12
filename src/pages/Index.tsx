
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Users, Heart, Globe } from "lucide-react";

const Index = () => {
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
    
    // In a real app, we would save this email or start a registration process
    toast({
      title: "Welcome!",
      description: "Your journey begins now. Explore our platform.",
    });
    
    // For now, just simulate navigation to a future feature
    navigate("/");
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
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
      
      {/* Features Section */}
      <div className="container mx-auto px-4 py-12 md:py-24">
        <h2 className="text-3xl font-bold text-center mb-12">Everything you need to connect</h2>
        
        <Tabs defaultValue="social" className="mx-auto max-w-4xl">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="social"><Globe className="mr-2" /> Social</TabsTrigger>
            <TabsTrigger value="chat"><MessageCircle className="mr-2" /> Chat</TabsTrigger>
            <TabsTrigger value="community"><Users className="mr-2" /> Community</TabsTrigger>
            <TabsTrigger value="dating"><Heart className="mr-2" /> Dating</TabsTrigger>
          </TabsList>
          
          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Social Networking</CardTitle>
                <CardDescription>Connect with friends and share your life</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>Build your personal profile, connect with friends, and share updates about your life. Our social networking features help you stay connected with the people you care about.</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Explore Social Features</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="chat" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Safe Chat Platform</CardTitle>
                <CardDescription>Engage in meaningful, moderated conversations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>Our chat platform is designed with safety in mind. All conversations are moderated to ensure a positive experience for everyone. Connect through text, voice, or video chat.</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Explore Chat Features</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="community" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Community Groups</CardTitle>
                <CardDescription>Find your tribe based on shared interests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>Join communities of people who share your interests. From hobbies to professional networking, our platform helps you connect with like-minded individuals and build lasting relationships.</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Explore Community Features</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="dating" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Dating Platform</CardTitle>
                <CardDescription>Find meaningful connections with appropriate guidelines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>Our dating platform is designed to help you find meaningful connections. With appropriate content guidelines and safety features, you can focus on building relationships that matter.</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Explore Dating Features</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Testimonials Section */}
      <div className="container mx-auto px-4 py-12 md:py-24">
        <h2 className="text-3xl font-bold text-center mb-12">What our users say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card/50">
            <CardContent className="pt-6">
              <p className="italic mb-4">"This platform has completely changed how I connect with others. The community features are amazing!"</p>
              <p className="font-semibold">- Alex T.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50">
            <CardContent className="pt-6">
              <p className="italic mb-4">"I love the moderated chat rooms. Finally a place where I can have real conversations without worrying about safety."</p>
              <p className="font-semibold">- Jamie L.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50">
            <CardContent className="pt-6">
              <p className="italic mb-4">"I found my partner through the dating feature. The focus on meaningful connections made all the difference."</p>
              <p className="font-semibold">- Sam R.</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="container mx-auto px-4 py-12 md:py-24 text-center">
        <Card className="max-w-2xl mx-auto bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Ready to get started?</CardTitle>
            <CardDescription className="text-primary-foreground/90">Join thousands of users already connecting on our platform</CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" variant="secondary" className="px-8">Create Your Account</Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Footer */}
      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">© 2023 Connect Platform. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <Button variant="link">Terms</Button>
            <Button variant="link">Privacy</Button>
            <Button variant="link">Community Guidelines</Button>
            <Button variant="link">Help</Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
