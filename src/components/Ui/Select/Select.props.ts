export interface Option {
  value: number;
  label: string;
}

export interface CustomSelectProps {
  options: Option[];
  onChange: (value: number) => void;
  className?: string;
  labelSelect: string;
}
