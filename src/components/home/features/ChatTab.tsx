
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const ChatTab = () => {
  return (
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
  );
};
