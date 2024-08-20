import { FC } from "react";
import s from "./Header.module.css";

export const Header: FC = () => {
  return (
    <div className={s["header"]}>
      <img className={s["header__logo"]} src="/pic/logo-big.png" alt="logo" />
      <div className={s["header_text"]}>
        <div>Приветствуем</div>
        <div>на хеппи педзей</div>
        <div>У Толянчика</div>
      </div>
    </div>
  );
};
