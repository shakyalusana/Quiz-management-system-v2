import * as React from "react";

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      setIsTablet(width >= 768 && width < 1024);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return isTablet;
}
