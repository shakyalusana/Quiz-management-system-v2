
import { Button } from "@/components/ui/button";
import { Shield, Home, ArrowLeft, Search } from "lucide-react";
import LinkComponent from "./Link";
import { Header } from "./landing/header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-2xl">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 text-center">
            {/* Error code */}
            <div className="mb-8">
              <div className="inline-block p-4 bg-accent/10 rounded-2xl mb-6">
                <Shield className="w-16 h-16 text-accent" />
              </div>
              <h1 className="text-7xl md:text-8xl font-bold text-foreground mb-4">
                404
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                Page Not Found
              </p>
            </div>

            {/* Error message */}
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
              The page you're looking for doesn't exist or has been moved. It
              seems this security vulnerability isn't the only thing that's gone
              missing.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <LinkComponent href="/">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 w-full sm:w-auto"
                >
                  <Home className="w-5 h-5" />
                  Back to Home
                </Button>
              </LinkComponent>
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-muted gap-2 w-full sm:w-auto"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </Button>
            </div>

            {/* Helpful links */}
            <div className="bg-card border border-border rounded-xl p-6 md:p-8">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2 justify-center">
                <Search className="w-5 h-5 text-accent" />
                Need Help Finding Something?
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <LinkComponent href="/">
                  <button className="w-full text-left p-4 rounded-lg border border-border hover:bg-muted transition-colors text-foreground hover:text-accent">
                    <p className="font-medium mb-1">Home</p>
                    <p className="text-sm text-muted-foreground">
                      Return to the main landing page
                    </p>
                  </button>
                </LinkComponent>
                <LinkComponent href="/login">
                  <button className="w-full text-left p-4 rounded-lg border border-border hover:bg-muted transition-colors text-foreground hover:text-accent">
                    <p className="font-medium mb-1">Sign In</p>
                    <p className="text-sm text-muted-foreground">
                      Access your account
                    </p>
                  </button>
                </LinkComponent>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}