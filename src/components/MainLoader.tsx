import { Shield } from "lucide-react";

const MainLoader = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Scanner */}
        <div className="relative flex items-center justify-center">
          {/* rotating scan ring */}
          <div className="absolute h-28 w-28 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>

          {/* pulsing core */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 animate-pulse">
            <Shield className="h-10 w-10 text-primary" />
          </div>
        </div>

        {/* text animation */}
        <div className="text-center">
          <h2 className="text-xl font-semibold tracking-wide">
            Scanning Security Layers
          </h2>

          <p className="text-sm text-muted-foreground animate-pulse">
            Preparing vulnerability scanner...
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainLoader;
