export interface ISliderInModalGlobalProps {
  children?: React.ReactNode;
  title?: string;
  open: boolean;
  className?:string
  setOpen: (open: boolean) => void;
}
