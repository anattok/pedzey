import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import s from "./Table.module.css";

import { RootState, AppDispatch, Store } from "../Store/Store";
import { fetchUsers, updateUserCoins } from "../../store/slice/usersSlice";

import { updateCoins } from "../../store/slice/authSlice";

import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { Button } from "../../components/Ui/Button/Button";
import { Loader } from "../../components/Ui/Loader/Loader";

import cn from "classnames";

export interface User {
  _id: string;
  userName: string;
  userSurname: string;
  coins: string;
  gift: string;
}

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

export const Table: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { users, loading, error } = useSelector<RootState, UsersState>(
    (state) => state.users
  );
  const currentUserRole = useSelector(
    (state: RootState) => state.auth.role // Предполагается, что вы храните роль текущего пользователя в auth slice
  );
  const currentUser = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleCoinChange = (userId: string, change: number) => {
    const user = users.find((u) => u._id === userId);
    if (user) {
      const newCoins = parseInt(user.coins) + change;
      dispatch(updateUserCoins({ userId, coins: newCoins.toString() })).then(
        () => {
          // Если обновляем коины текущего пользователя, обновляем их и в authSlice
          if (currentUser._id === userId) {
            dispatch(updateCoins(newCoins));
          }
        }
      );
    }
  };

  const handleRefreshTable = () => {
    dispatch(fetchUsers());
  };

  const goToStore = () => {
    navigate("/store"); // Переход на страницу /store
  };

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Header />
      {currentUserRole === "admin" && (
        <Button className={s["store-button"]} onClick={goToStore}>
          Перейти в магазин
        </Button>
      )}
      <div className={s["table"]}>
        <div className={s["table__top"]}>
          <p className={s["table__title"]}>РЕЙТИНГ ГОСТЕЙ:</p>
          <button
            className={s["table__refresh"]}
            onClick={handleRefreshTable}
          ></button>
        </div>

        <div className={s.body}>
          {users.map((user) => (
            <div key={user._id} className={s["table__row"]}>
              <div className={s["table__cell"]}>
                <div className={s["table__names"]}>
                  {`${user.userName} ${user.userSurname.charAt(0)}.`}
                </div>
                {currentUserRole === "admin" && (
                  <div className={s["coin-controls"]}>
                    <Button
                      className={cn(s["coin-button"], s["coin-button__plus"])}
                      onClick={() => handleCoinChange(user._id, 1)}
                    >
                      +
                    </Button>
                    <Button
                      className={cn(s["coin-button"], s["coin-button__minus"])}
                      onClick={() => handleCoinChange(user._id, -1)}
                    >
                      -
                    </Button>
                  </div>
                )}
              </div>
              <div className={s["table__cell-coins"]}>{user.coins}</div>
              {/* Добавьте другие столбцы при необходимости */}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};
