import { BrainCircuit } from "lucide-react";

const MainLoader = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center overflow-hidden bg-background relative">
      {/* floating blurred orbs */}
      <div className="absolute top-20 left-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 h-52 w-52 rounded-full bg-primary/5 blur-3xl animate-pulse"></div>

      <div className="flex flex-col items-center gap-8">
        {/* Quiz Orb */}
        <div className="relative flex items-center justify-center">
          {/* outer rotating ring */}
          <div className="absolute h-36 w-36 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>

          {/* middle dashed ring */}
          <div className="absolute h-28 w-28 rounded-full border-2 border-dashed border-primary/40 animate-[spin_8s_linear_infinite_reverse]"></div>

          {/* glowing core */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 shadow-2xl shadow-primary/20 backdrop-blur-md animate-pulse">
            <BrainCircuit className="h-10 w-10 text-primary" />
          </div>

          {/* ping effect */}
          <div className="absolute h-20 w-20 rounded-full bg-primary/20 animate-ping"></div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2 text-center">
          <h1 className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-3xl font-bold tracking-wide text-transparent">
            Quiz Management System
          </h1>

          <p className="text-sm tracking-widest text-muted-foreground uppercase animate-pulse">
            Loading Questions • Calculating Scores • Brewing Knowledge ☕
          </p>
        </div>

        {/* progress dots */}
        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-primary animate-bounce"></span>
          <span className="h-3 w-3 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></span>
          <span className="h-3 w-3 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></span>
        </div>
      </div>
    </div>
  );
};

export default MainLoader;
