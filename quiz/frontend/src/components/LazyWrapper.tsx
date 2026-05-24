import { Suspense, type ComponentType } from "react";
import ErrorBoundary from "../../ErrorBoundry";

interface LazyWrapperProps {
  Component: ComponentType;
}

// const SplashScreen = () => (
//   <DefaultContainer className="flex flex-col items-center justify-center min-h-screen bg-background">
//     <MainLoader />
//   </DefaultContainer>
// );

const LazyWrapper = ({ Component }: LazyWrapperProps) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
};
export default LazyWrapper;