import { FC } from "react";
import s from "./Footer.module.css";
import { clearAuthData } from "../../store/slice/authSlice";
import { Button } from "../../components/Ui/Button/Button";
import { clearUserData } from "../../store/localStorage/user";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";

export const Footer: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userName, role } = useSelector((state: RootState) => state.auth);
  const logout = () => {
    clearUserData(); // Очищаем localStorage
    dispatch(clearAuthData()); // Очищаем данные аутентификации в Redux
  };
  return (
    <div className={s["footer"]}>
      {role === "user" && (
        <div className={s.text}>
          {`${userName}, Толянчик рад был видеть тебя на Хеппи Педзей!`}
        </div>
      )}
      <Button className={s["exit"]} onClick={logout}>
        уйти с тусовки
      </Button>
    </div>
  );
};
