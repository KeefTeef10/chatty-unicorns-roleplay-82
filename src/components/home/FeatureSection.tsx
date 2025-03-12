
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Users, Heart, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export const FeatureSection = () => {
  return (
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
  );
};
