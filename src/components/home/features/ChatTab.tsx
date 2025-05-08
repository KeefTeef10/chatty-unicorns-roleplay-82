
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const ChatTab = () => {
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
        <Button variant="outline" className="w-full">Explore Secure Chat Features</Button>
      </CardFooter>
    </Card>
  );
};
