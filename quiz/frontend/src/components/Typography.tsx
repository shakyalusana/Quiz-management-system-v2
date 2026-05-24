import React from "react";
import clsx from "clsx";

interface TypographyProps {
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body"
    | "small"
    | "caption"
    | "span";
  color?:
    | "primary"
    | "secondary"
    | "muted"
    | "danger"
    | "success"
    | "warning"
    | "info"
    | "white"
    | "black";
  size?:
    | "xs"
    | "sm"
    | "base"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | string;
  weight?: "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold";
  align?: "left" | "center" | "right" | "justify";
  decoration?: "none" | "underline" | "line-through" | "overline";
  transform?: "normal-case" | "uppercase" | "lowercase" | "capitalize";
  tracking?: "tighter" | "tight" | "normal" | "wide" | "wider" | "widest";
  leading?: "none" | "tight" | "snug" | "normal" | "relaxed" | "loose";
  className?: string;
  children: React.ReactNode;
}

const Typography: React.FC<TypographyProps> = ({
  variant = "body",
  color = "primary",
  size,
  weight,
  align,
  decoration = "none",
  transform,
  tracking,
  leading,
  className,
  children,
}) => {
  const variantClasses: Record<string, string> = {
    h1: "text-5xl font-bold",
    h2: "text-4xl font-semibold",
    h3: "text-3xl font-semibold",
    h4: "text-2xl font-medium",
    h5: "text-xl font-medium",
    h6: "text-lg font-medium",
    body: "text-base font-normal",
    small: "text-sm",
    caption: "text-xs",
  };

  const colorClasses: Record<string, string> = {
    primary: "text-primary dark:text-primary",
    secondary: "text-muted-foreground dark:text-muted-foreground",
    muted: "text-muted dark:text-muted",
    danger: "text-destructive dark:text-destructive",
    success: "text-success dark:text-success",
    warning: "text-warning dark:text-warning",
    info: "text-info dark:text-info",
    white: "text-background",
    black: "text-black",
  };

  const Tag =
    variant === "body" || variant === "small" || variant === "caption"
      ? "p"
      : variant;

  return (
    <Tag
      className={clsx(
        "font-poppins",
        variantClasses[variant],
        colorClasses[color],
        size && `text-${size}`,
        weight && `font-${weight}`,
        align && `text-${align}`,
        decoration !== "none" && decoration,
        transform && transform,
        tracking && `tracking-${tracking}`,
        leading && `leading-${leading}`,
        className,
      )}
    >
      {children}
    </Tag>
  );
};

export default Typography;