import { BrainCircuit } from "lucide-react";

const MainLoader = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background relative overflow-hidden">
      {/* 🌌 soft gradient atmosphere */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/10" />

      {/* floating glow orbs */}
      <div className="absolute top-24 left-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-24 right-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl animate-pulse" />

      <div className="flex flex-col items-center gap-10 z-10">
        {/* CORE SCANNER */}
        <div className="relative flex items-center justify-center">
          {/* outer slow orbit */}
          <div className="absolute h-40 w-40 rounded-full border border-primary/20 animate-spin-slow" />

          {/* scanning ring */}
          <div className="absolute h-32 w-32 rounded-full border-t-2 border-primary animate-spin" />

          {/* inner pulse field */}
          <div className="absolute h-24 w-24 rounded-full bg-primary/10 blur-md animate-pulse" />

          {/* brain core */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-card border border-primary/20 shadow-xl shadow-primary/10">
            <BrainCircuit className="h-9 w-9 text-primary animate-pulse" />
          </div>

          {/* scanning line effect */}
          <div className="absolute h-44 w-1 bg-linear-to-b from-transparent via-primary/40 to-transparent animate-[spin_2.5s_linear_infinite]" />
        </div>

        {/* 🧾 TEXT */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Initializing Quiz Engine
          </h1>

          <p className="text-sm text-muted-foreground tracking-wide">
            Loading • Structuring Questions • Preparing Challenge
          </p>
        </div>

        {/* 📶 progress bars */}
        <div className="flex gap-2">
          <div className="h-2 w-16 rounded-full bg-primary/20 overflow-hidden">
            <div className="h-full w-full bg-primary animate-[loading_1.2s_ease-in-out_infinite]" />
          </div>

          <div className="h-2 w-16 rounded-full bg-primary/20 overflow-hidden">
            <div className="h-full w-full bg-primary animate-[loading_1.2s_ease-in-out_infinite_0.2s]" />
          </div>

          <div className="h-2 w-16 rounded-full bg-primary/20 overflow-hidden">
            <div className="h-full w-full bg-primary animate-[loading_1.2s_ease-in-out_infinite_0.4s]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLoader;
