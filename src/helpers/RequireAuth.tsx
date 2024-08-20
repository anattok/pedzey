import { ReactNode, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store/store";
import { setAuthData } from "../store/slice/authSlice";
import { PREFIX } from "./API";
import { Loader } from "../components/Ui/Loader/Loader";

interface RequireAuthProps {
  children: ReactNode;
}

const loadUserDataFromLocalStorage = () => {
  const jsonState = localStorage.getItem("userData");
  if (jsonState) {
    try {
      return JSON.parse(jsonState);
    } catch (error) {
      console.error("Ошибка при парсинге данных из localStorage", error);
    }
  }
  return null;
};

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUserData = loadUserDataFromLocalStorage();

      if (storedUserData && storedUserData.accessToken) {
        dispatch(setAuthData(storedUserData));
        setIsAuthenticated(true);
        return;
      }

      if (!accessToken) {
        try {
          const response = await fetch(`${PREFIX}/api/checkAuth`, {
            method: "GET",
            credentials: "include",
          });

          if (response.ok) {
            const userData = await response.json();
            dispatch(setAuthData(userData));
            localStorage.setItem("userData", JSON.stringify(userData));
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Ошибка при проверке аутентификации", error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, [accessToken, dispatch]);

  if (isAuthenticated === null) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // // Перенаправление на нужный маршрут в зависимости от роли пользователя
  // if (role === "admin") {
  //   return <Navigate to="/table" replace />;
  // } else if (role === "user") {
  //   return <Navigate to="/store" replace />;
  // }

  return <>{children}</>;
};
