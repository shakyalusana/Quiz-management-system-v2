import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import DefaultContainer from "@/components/DefaultContainer";

export default function RouteError() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = "Something went wrong";
  let description = "An unexpected error occurred. Please try again.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} – ${error.statusText}`;
    description =
      error.status === 404
        ? "The page you are looking for does not exist."
        : "We couldn’t process your request.";
  } else if (error instanceof Error) {
    description = error.message;
  }

  return (
    <DefaultContainer
      align="center"
      justify="center"
      className=" min-h-screen  bg-background px-4"
    >
      <DefaultContainer className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm">
        <DefaultContainer
          direction="col"
          align="center"
          className=" text-center"
        >
          <DefaultContainer
            align="center"
            justify="center"
            className="mb-4  h-12 w-12 rounded-full bg-destructive/10"
          >
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </DefaultContainer>

          <Typography weight="semibold" size="lg">
            {title}
          </Typography>
          <Typography size="sm" color="muted" className="mt-2">
            {description}
          </Typography>

          <DefaultContainer gap="3" className="mt-6  ">
            <Button
              onClick={() => navigate(-1)}
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Go Back
            </Button>

            <Button
              onClick={() => window.location.reload()}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Reload
            </Button>
          </DefaultContainer>
        </DefaultContainer>
      </DefaultContainer>
    </DefaultContainer>
  );
}