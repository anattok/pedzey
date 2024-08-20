import { FC, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { setAuthData } from "./../../store/slice/authSlice"; // Импортируем action из authSlice
import { AppDispatch } from "././../../store/store"; // Импортируем тип AppDispatch
import { Button } from "../../components/Ui/Button/Button";
import { Input } from "../../components/Ui/Input/Input";
import s from "./Login.module.css";
import { PREFIX } from "../../helpers/API";
import { saveState } from "../../store/localStorage/jwt";
import { DATA_PERSISTENT_STATE } from "../../store/localStorage/userData";
import { useNavigate } from "react-router-dom";
// Типизация для формы
export type LoginForm = {
  name: {
    value: string;
  };
  surname: {
    value: string;
  };
};

export const Login: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); // Используем useNavigate для редиректа

  const loginUser = async (name: string, surname: string) => {
    try {
      const response = await fetch(`${PREFIX}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name, surname: surname }),
      });

      //   if (response.ok) {
      //     const data = await response.json();
      //     saveState(DATA_PERSISTENT_STATE, data);
      //     dispatch(setAuthData(data)); // Сохраняем данные в Redux
      //     console.log("User logged in successfully:", data);
      //     navigate("/table");
      //   } else {
      //     const errorData = await response.json();
      //     console.error("Error:", errorData.message);
      //   }
      // } catch (error) {
      //   console.error("Network error:", error);
      // }
      if (response.ok) {
        const data = await response.json();
        saveState(DATA_PERSISTENT_STATE, data);
        dispatch(setAuthData(data)); // Сохраняем данные в Redux
        console.log("User logged in successfully:", data.role);

        // Перенаправление на страницу в зависимости от роли пользователя
        if (data.role === "admin") {
          navigate("/table");
        } else if (data.role === "user") {
          navigate("/store");
        }
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & LoginForm;
    const { name, surname } = target;

    const trimmedName = name.value.trim();
    const trimmedSurname = surname.value.trim();

    await loginUser(trimmedName, trimmedSurname);
  };

  return (
    <div className={s["login"]}>
      <img className={s["login__logo"]} src="/pic/logo-big.png" alt="" />
      <p className={s["login__text"]}>Приветствуем на хеппи педзей</p>
      <form className={s["form"]} onSubmit={submit}>
        <Input
          className={s["form__input"]}
          type="text"
          name="surname"
          placeholder="Фамилия"
          id="surname"
        />
        <Input
          className={(s["form__input"], s["form__input-name"])}
          type="text"
          name="name"
          placeholder="Имя"
          id="name"
        />

        <Button className={s["login__btn"]}>Зайти в гости</Button>
        <div></div>
      </form>
    </div>
  );
};
