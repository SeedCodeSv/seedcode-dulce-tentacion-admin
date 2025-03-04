import { Tooltip } from "@heroui/react";
interface Props {
  children: JSX.Element;
  text: string;
  color?: string;
}
function TooltipGlobal(props: Props) {
  return (
    <Tooltip content={props.text} color='primary' className="dark:text-white dark:bg-gray-800 ">
      {props.children}
    </Tooltip>
  );
}

export default TooltipGlobal;
