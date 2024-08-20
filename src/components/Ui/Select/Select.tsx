import { FC, useEffect, useState } from "react";
import cn from "classnames";
import s from "./Select.module.css";
import { CustomSelectProps, Option } from "./Select.props";

export const Select: FC<CustomSelectProps> = ({
  options,
  labelSelect,
  className,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [label, setLabel] = useState(labelSelect);

  useEffect(() => {
    setLabel(labelSelect);
  }, [labelSelect]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const optionClick = (option: Option) => {
    setLabel(option.label);
    onChange(option.value);
  };

  return (
    <div className={cn(s["select"], className)} onClick={handleToggle}>
      {label}
      {isOpen && (
        <ul className={s["select__list"]}>
          {options.map((option, index) => (
            <li
              className={s["select__item"]}
              onClick={() => optionClick(option)}
              key={index}
              value={option.value}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
