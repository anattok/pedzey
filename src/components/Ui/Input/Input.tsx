import { FC } from "react";
import cn from "classnames";
import { InputProps } from "./Input.props";
import s from "./Input.module.css";

export const Input: FC<InputProps> = ({
  isValid = true,
  className,
  ref,
  ...props
}) => {
  return (
    <input
      ref={ref}
      className={cn(s["input"], className, {
        [s["invalid"]]: !isValid,
      })}
      {...props}
    />
  );
};
