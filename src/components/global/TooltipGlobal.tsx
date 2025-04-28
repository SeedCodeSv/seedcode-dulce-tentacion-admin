import { Tooltip } from "@heroui/react";
interface Props {
  children: JSX.Element;
  text: string;
  color?: string;
}
function TooltipGlobal(props: Props) {
  return (
    <Tooltip className="dark:text-white dark:bg-gray-800 " color='primary' content={props.text}>
      {props.children}
    </Tooltip>
  );
}

export default TooltipGlobal;
