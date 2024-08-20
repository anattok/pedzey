import { FC, useState, ChangeEvent } from "react";
import s from "./Checkbox.module.css";
import classNames from "classnames";

interface CheckboxProps {
  isChecked?: boolean;
  onChange?: (isChecked: boolean) => void;
  className?: string;
}

export const Checkbox: FC<CheckboxProps> = ({
  isChecked: initialChecked = false,
  onChange,
  className,
}) => {
  const [isChecked, setChecked] = useState(initialChecked);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newCheckedValue = event.target.checked;
    setChecked(newCheckedValue);

    if (onChange) {
      onChange(newCheckedValue);
    }
  };

  return (
    <div className={classNames(s["checkbox"], className)}>
      <label className={s["checkbox__label"]}>
        <input
          className={s["checkbox__input"]}
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <span className={s["checkbox__checkmark"]}></span>
      </label>
    </div>
  );
};
