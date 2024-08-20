import { FC } from "react";
import { Outlet } from "react-router-dom";
import { Container } from "./../components/Ui/Container/Container";

export const Layout: FC = () => {
  return (
    <>
      <Container>
        <Outlet />
      </Container>
    </>
  );
};
