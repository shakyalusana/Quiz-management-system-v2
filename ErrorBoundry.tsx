import React from "react";
import { AlertTriangle } from "lucide-react";
import DefaultContainer from "@/components/DefaultContainer";
import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";

type Props = {
  children: React.ReactNode;
  compact?: boolean;
};

type State = {
  hasError: boolean;
  error?: Error;
  errorId?: string;
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: crypto.randomUUID(),
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(" ErrorBoundary caught:", {
      message: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    const { hasError, error, errorId } = this.state;
    const { children, compact } = this.props;

    if (!hasError) return children;

    if (compact) {
      return (
        <DefaultContainer className="rounded-md border bg-destructive/5 p-4">
          <Typography weight="medium" color="danger">
            Something went wrong.
          </Typography>
          <Button onClick={this.handleReset} className="mt-2 p-0">
            Try again
          </Button>
        </DefaultContainer>
      );
    }

    return (
      <DefaultContainer
        align="center"
        justify="center"
        className="min-h-screen bg-background px-4"
      >
        <DefaultContainer className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm">
          <DefaultContainer
            direction="col"
            align="center"
            className="text-center"
          >
            <DefaultContainer
              align="center"
              justify="center"
              className="mb-4 h-12 w-12 rounded-full bg-destructive/10"
            >
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </DefaultContainer>

            <Typography weight="semibold" size="lg">
              Something went wrong
            </Typography>

            <Typography size="sm" color="muted" className="mt-2">
              An unexpected error occurred. You can try reloading the page or
              contact support if the problem persists.
            </Typography>

            <DefaultContainer gap="3" className="mt-6">
              <Button variant="outline" onClick={this.handleReset}>
                Try again
              </Button>

              <Button onClick={this.handleReload}>Reload</Button>
            </DefaultContainer>

            {import.meta.env.DEV && error && (
              <DefaultContainer className="mt-6 w-full text-left">
                <Typography size="xs" weight="semibold" color="muted">
                  Error ID: {errorId}
                </Typography>
                <pre className="mt-2 max-h-40 overflow-auto rounded-md bg-muted p-3 text-xs text-muted-foreground">
                  {error.stack}
                </pre>
              </DefaultContainer>
            )}
          </DefaultContainer>
        </DefaultContainer>
      </DefaultContainer>
    );
  }
}

export default ErrorBoundary;