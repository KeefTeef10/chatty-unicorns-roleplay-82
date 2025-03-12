
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Users, Heart, Globe } from "lucide-react";
import { SocialTab } from "./features/SocialTab";
import { ChatTab } from "./features/ChatTab";
import { CommunityTab } from "./features/CommunityTab";
import { DatingTab } from "./features/DatingTab";

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
          <SocialTab />
        </TabsContent>
        
        <TabsContent value="chat" className="space-y-4">
          <ChatTab />
        </TabsContent>
        
        <TabsContent value="community" className="space-y-4">
          <CommunityTab />
        </TabsContent>
        
        <TabsContent value="dating" className="space-y-4">
          <DatingTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
