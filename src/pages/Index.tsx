
import { HeroSection } from "@/components/home/HeroSection";
import { FeatureSection } from "@/components/home/FeatureSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CallToAction } from "@/components/home/CallToAction";
import { Footer } from "@/components/home/Footer";
import { ChatPreview } from "@/components/home/ChatPreview";

const Index = () => {
  return (
    <div className="min-h-screen bg-background cyber-grid">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background/50 to-background pointer-events-none" />
        <HeroSection />
        <ChatPreview />
        <FeatureSection />
        <TestimonialsSection />
        <CallToAction />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
