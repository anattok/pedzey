import { InputHTMLAttributes, RefObject } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  isValid?: true;
  ref?: RefObject<HTMLInputElement>;
}
