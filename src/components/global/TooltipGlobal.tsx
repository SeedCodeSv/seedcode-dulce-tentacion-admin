import { Tooltip } from "@heroui/react";

interface Props {
  children: JSX.Element;
  text: string;
  color?: string;
}
function TooltipGlobal(props: Props) {
  return (
    <Tooltip className="dark:text-white dark:bg-gray-800 shadow-lg border border-rose-200" content={props.text}>
      {props.children}
    </Tooltip>
  );
}

export default TooltipGlobal;
