
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const CommunityTab = () => {
  return (
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
  );
};
