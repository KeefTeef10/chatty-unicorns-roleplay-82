
import { Card, CardContent } from "@/components/ui/card";

export const TestimonialsSection = () => {
  return (
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
  );
};
