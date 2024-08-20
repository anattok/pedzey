import s from "./Button.module.css";
import { ButtonProps } from "./Button.props";
import { FC } from "react";
import cn from "classnames";

export const Button: FC<ButtonProps> = ({
  children,
  className,
  appearance = "small",
  ...props
}) => {
  return (
    <button
      className={cn(s["button"], s["primary"], className, {
        [s["small"]]: appearance === "small",
        [s["medium"]]: appearance === "medium",
        [s["large"]]: appearance === "large",
      })}
      {...props}
    >
      {children}
    </button>
  );
};
