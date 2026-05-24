import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import LinkComponent from "../Link";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";


export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-accent rounded-lg">
            <Shield className="w-6 h-6 text-accent-foreground" />
          </div>
          <span className="font-bold text-xl text-foreground">VulnScan</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#benefits"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Benefits
          </a>
          <a
            href="#pricing"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <AnimatedThemeToggler />
          <LinkComponent href="/login">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Get Started
            </Button>
          </LinkComponent>
        </div>
      </div>
    </header>
  );
}