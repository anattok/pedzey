// import React, { useEffect, useState } from "react";
// import io from "socket.io-client";
// import Card from "../Card/Card";
// import s from "./Store.module.css";
// import { Header } from "../../components/Header/Header";
// import { Footer } from "../../components/Footer/Footer";
// import { RootState } from "../../store/store";
// import { useSelector } from "react-redux";
// import { PREFIX } from "../../helpers/API";
// import { Loader } from "../../components/Ui/Loader/Loader";

// const socket = io(`${PREFIX}`, {
//   transports: ["websocket"],
//   withCredentials: true, // Убедитесь, что флаг withCredentials установлен, если используется авторизация
// });

// interface Product {
//   _id: string;
//   title: string;
//   selected: string;
//   price: number;
//   imageUrl: string;
// }

// export const Store: React.FC = () => {
//   const { coins, userName } = useSelector((state: RootState) => state.auth);

//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedProductId, setSelectedProductId] = useState<string | null>(
//     null
//   );
// //
//   useEffect(() => {
//     socket.emit("getProducts"); // Запросите начальные данные

//     socket.on("products", (data: Product[]) => {
//       setProducts(data);
//       setLoading(false);
//     });

//     socket.on("productClaimed", (updatedProduct: Product) => {
//       setProducts((prevProducts) =>
//         prevProducts.map((product) =>
//           product._id === updatedProduct._id ? updatedProduct : product
//         )
//       );
//       if (updatedProduct.selected === userName) {
//         setSelectedProductId(updatedProduct._id);
//       }
//     });

//     return () => {
//       socket.off("products");
//       socket.off("productClaimed");
//     };
//   }, []);

//   const handleClaim = (productId: string) => {
//     if (selectedProductId) {
//       return; // Если товар уже выбран, не делать ничего
//     }

//     socket.emit("claimProduct", productId, userName);
//   };

//   const getTolyanчиковString = (count: number): string => {
//     if (count % 10 === 1 && count % 100 !== 11) {
//       return "толянчик";
//     } else if (
//       count % 10 >= 2 &&
//       count % 10 <= 4 &&
//       (count % 100 < 10 || count % 100 >= 20)
//     ) {
//       return "толянчика";
//     } else {
//       return "толянчиков";
//     }
//   };

//   if (loading) {
//     return <Loader />;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <>
//       <Header />
//       <div className={s.heading}>
//         {`${userName}, у тебя ${coins} ${getTolyanчиковString(
//           coins
//         )}, выбери себе что-нибудь`}
//       </div>
//       <div className={s.store}>
//         {products.map((product) => (
//           <Card
//             key={product._id}
//             title={product.title}
//             price={product.price}
//             imageUrl={product.imageUrl}
//             selected={product.selected}
//             onClaim={() => handleClaim(product._id)}
//             isDisabled={
//               selectedProductId !== null && selectedProductId !== product._id
//             }
//           />
//         ))}
//       </div>
//       <Footer />
//     </>
//   );
// };

import React, { useEffect, useState } from "react";
import Card from "../Card/Card"; // Предполагаем, что Card находится в том же каталоге
import s from "./Store.module.css";

import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";

import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { updateCoins } from "../../store/slice/authSlice";
import { Loader } from "../../components/Ui/Loader/Loader";
import { PREFIX } from "../../helpers/API";

interface Product {
  _id: string;
  title: string;
  selected: string;
  price: number;
  imageUrl: string;
}

export const Store: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { coins, userName } = useSelector((state: RootState) => state.auth);

  // Состояние для хранения списка товаров
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  //получаем все товары и рендерим на страницу
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${PREFIX}/api/products`);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Ошибка при загрузке товаров");

        return <Loader />;
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleClaim = async (productId: string, productPrice: number) => {
    try {
      // Проверяем, достаточно ли монет для покупки
      if (coins < productPrice) {
        alert("У вас недостаточно толянчиков для покупки этого товара.");
        return;
      }

      const response = await fetch(
        `${PREFIX}/api/products/${productId}/claim`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ claimedBy: userName }), // Отправляем имя пользователя
        }
      );

      if (!response.ok) {
        throw new Error("Не удалось совершить покупку товара");
      }

      // Обновляем состояние товаров
      const updatedProduct = await response.json();
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId ? updatedProduct : product
        )
      );

      // Отнимаем цену товара от количества монет
      dispatch(updateCoins(coins - productPrice));
    } catch (error) {
      console.error("Ошибка при покупке товара:", error);
    }
  };

  //склонение слова
  const getTolyanчиковString = (count: number): string => {
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
      <div className={s.heading}>
        {`${userName}, у тебя ${coins} ${getTolyanчиковString(
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
            onClaim={() => handleClaim(product._id, product.price)} // Передача функции обработки нажатия кнопки
          />
        ))}
      </div>
      <Footer />
    </>
  );
};
