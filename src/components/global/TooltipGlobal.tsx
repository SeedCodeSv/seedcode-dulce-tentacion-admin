import { Tooltip } from '@nextui-org/react';
interface Props {
  children: JSX.Element;
  text: string;
  color?: string;
}
function TooltipGlobal(props: Props) {
  return (
    <Tooltip content={props.text} color='primary' className="dark:text-white ">
      {props.children}
    </Tooltip>
  );
}

export default TooltipGlobal;
