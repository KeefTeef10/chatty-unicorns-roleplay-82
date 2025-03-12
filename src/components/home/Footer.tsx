
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
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
  );
};
