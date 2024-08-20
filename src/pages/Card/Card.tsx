import React from "react";
import styles from "./Card.module.css";
import { Button } from "../../components/Ui/Button/Button";

type CardProps = {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  selected: string;
  onClaim: () => void;
};

const Card: React.FC<CardProps> = ({
  title,
  price,
  imageUrl,
  selected,
  onClaim,
}) => {
  const isClaimed = !!selected; // Проверяем, если есть значение в selected

  return (
    <div className={styles.card}>
      <img className={styles.img} src={imageUrl} alt={title} />
      <h3 className={styles.text}>{title}</h3>
      <p className={styles.price}>{`ценник ${price} толянчиков`}</p>
      <Button
        className={`${styles.button} ${isClaimed ? styles.disabled : ""}`}
        onClick={!isClaimed ? onClaim : undefined}
        disabled={isClaimed}
      >
        {isClaimed
          ? `Забрал${
              [
                "Анастасия",
                "Маша",
                "Елена",
                "Аня",
                "Victoria",
                "Lelya",
              ].includes(selected)
                ? "а"
                : ""
            } ${selected}`
          : "Хочу забрать!"}
      </Button>
    </div>
  );
};

export default Card;
