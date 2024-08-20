import { FC, ChangeEvent } from "react";
import s from "./Radio.module.css";

interface RadioProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Radio: FC<RadioProps> = ({ label, checked, onChange }) => {
  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <div className={s["radio"]}>
      <label className={s["radioLabel"]}>
        <input
          type="radio"
          checked={checked}
          onChange={handleRadioChange}
          className={s["radioInput"]}
        />
        <span className={s["radioLabel__name"]}>{label}</span>
      </label>
    </div>
  );
};
