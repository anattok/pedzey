import { FC } from "react";
import { Outlet } from "react-router-dom";
import s from "./AuthLayout.module.css";
import { Container } from "../../components/Ui/Container/Container";

export const AuthLayout: FC = () => {
  return (
    <div className={s["form"]}>
      <Container>
        <Outlet />
      </Container>
    </div>
  );
};
