import s from "./Loader.module.css";
import { FC } from "react";

export const Loader: FC = () => {
  return (
    <div className={s["loader-container"]}>
      <div className={s["loader"]}></div>
    </div>
  );
};
