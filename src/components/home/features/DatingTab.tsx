
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const DatingTab = () => {
  return (
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
  );
};
