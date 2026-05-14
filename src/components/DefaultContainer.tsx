import React from "react";
import clsx from "clsx";

interface DefaultContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  display?:
    | "flex"
    | "grid"
    | "block"
    | "inline-flex"
    | "inline-block"
    | null
    | string;
  direction?: "row" | "row-reverse" | "col" | "col-reverse" | null | string;
  align?: "start" | "center" | "end" | "stretch" | "baseline" | null | string;
  justify?:
    | "start"
    | "center"
    | "end"
    | "between"
    | "around"
    | "evenly"
    | null
    | string;
  wrap?: "wrap" | "nowrap" | "wrap-reverse" | null | string;
  gap?: string | null;
  gridCols?: string;
  padding?: string;
  margin?: string;
  width?: "full" | string;
  height?: "full" | string;
  rounded?: string;
  shadow?: string;
  bg?: string;
  border?: boolean;
  borderColor?: string;
  className?: string;
  children: React.ReactNode;
}

const DefaultContainer: React.FC<DefaultContainerProps> = ({
  display = "flex",
  direction,
  align,
  justify,
  wrap,
  gap,
  gridCols,
  padding,
  margin,
  width,
  height,
  rounded,
  shadow,
  bg,
  border,
  borderColor,
  className,
  children,
  ...props
}) => {
  const containerClasses = clsx(
    display,
    display === "flex" && `flex-${direction}`,
    display === "grid" && gridCols && `grid grid-cols-${gridCols}`,
    wrap && `flex-${wrap}`,
    align && `items-${align}`,
    justify && `justify-${justify}`,
    gap && `gap-${gap}`,
    padding && `p-${padding}`,
    margin && `m-${margin}`,
    width && `w-${width}`,
    height && `h-${height}`,
    rounded && `rounded-${rounded}`,
    shadow && `shadow-${shadow}`,
    bg && `${bg}`,
    border && "border",
    borderColor && `border-${borderColor}`,
    className,
  );

  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
};

export default DefaultContainer;