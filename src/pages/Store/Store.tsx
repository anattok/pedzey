import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Card from "../Card/Card";
import s from "./Store.module.css";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { updateCoins } from "../../store/slice/authSlice";
import { Loader } from "../../components/Ui/Loader/Loader";
import { PREFIX } from "../../helpers/API";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Ui/Button/Button";

// Инициализация сокета
const socket = io(`${PREFIX}`, {
  transports: ["websocket"],
  withCredentials: true, // Убедитесь, что флаг withCredentials установлен, если используется авторизация
});

interface Product {
  _id: string;
  title: string;
  selected: string;
  price: number;
  imageUrl: string;
}

export const Store: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { coins, userName } = useSelector((state: RootState) => state.auth);
  const currentUserRole = useSelector(
    (state: RootState) => state.auth.role // Предполагается, что вы храните роль текущего пользователя в auth slice
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Подписка на событие получения продуктов
    socket.emit("getProducts");

    socket.on("products", (data: Product[]) => {
      setProducts(data);
      setLoading(false);
    });

    // Обработка события, когда продукт был успешно куплен (выбран)
    socket.on("productClaimed", (updatedProduct: Product) => {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        )
      );
    });

    return () => {
      socket.off("products");
      socket.off("productClaimed");
    };
  }, []);

  const goToTable = () => {
    navigate("/table"); // Переход на страницу /store
  };

  const handleClaim = async (productId: string, productPrice: number) => {
    try {
      if (coins < productPrice) {
        alert("У вас недостаточно толянчиков для покупки этого товара.");
        return;
      }

      // Логируем отправку события
      console.log("Отправка запроса на сервер через сокет...");

      // Отправляем запрос на сервер через сокет
      socket.emit("claimProduct", productId, userName, (response: any) => {
        if (response && response.success) {
          console.log("Покупка прошла успешно, обновление данных...");
          // Обновляем состояние коинов и сохраняем в localStorage
          dispatch(updateCoins(coins - productPrice));
        } else {
          console.error("Ошибка сервера или некорректный ответ: ", response);
          alert("Не удалось совершить покупку товара");
        }
      });
    } catch (error) {
      console.error("Ошибка при обработке покупки через сокет:", error);
    }
  };

  const getTolyanString = (count: number): string => {
    if (count % 10 === 1 && count % 100 !== 11) {
      return "толянчик";
    } else if (
      count % 10 >= 2 &&
      count % 10 <= 4 &&
      (count % 100 < 10 || count % 100 >= 20)
    ) {
      return "толянчика";
    } else {
      return "толянчиков";
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Header />
      {currentUserRole === "admin" && (
        <Button className={s["table-button"]} onClick={goToTable}>
          Перейти в таблицу
        </Button>
      )}
      <div className={s.heading}>
        {`${userName}, у тебя ${coins} ${getTolyanString(
          coins
        )}, выбери себе что-нибудь`}
      </div>
      <div className={s.store}>
        {products.map((product) => (
          <Card
            key={product._id}
            title={product.title}
            selected={product.selected}
            price={product.price}
            imageUrl={product.imageUrl}
            onClaim={() => handleClaim(product._id, product.price)}
          />
        ))}
      </div>
      <Footer />
    </>
  );
};
