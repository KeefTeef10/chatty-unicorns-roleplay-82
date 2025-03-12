
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const CallToAction = () => {
  return (
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
  );
};
