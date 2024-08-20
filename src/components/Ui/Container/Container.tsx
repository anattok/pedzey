import s from "./Container.module.css";
import { FC } from "react";
import { ContainerProps } from "./Container.props";
import cn from "classnames";

export const Container: FC<ContainerProps> = ({ children, className }) => {
  return <div className={cn(s["container"], className)}>{children}</div>;
};
