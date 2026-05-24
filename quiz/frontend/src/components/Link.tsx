import { cn } from "@/libs/utils";
import { memo } from "react";
import { Link, type LinkProps } from "react-router-dom";

interface LinkComponentProps extends Omit<LinkProps, "to"> {
  href?: string;
  label?: string;
  unstyled?: boolean;
}

const LinkComponent = memo<LinkComponentProps>(
  ({ href = "#", label, children, unstyled, className, ...props }) => (
    <Link
      to={href}
      className={cn(!unstyled && "hover:underline", className)}
      {...props}
    >
      {label || children}
    </Link>
  ),
);

LinkComponent.displayName = "LinkComponent";

export { LinkComponent };
export default LinkComponent;
export type { LinkComponentProps };