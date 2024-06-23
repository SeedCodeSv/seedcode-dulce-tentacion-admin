import { Tooltip } from '@nextui-org/react';
interface Props {
  childrem: JSX.Element;
  text: string;
  color?: string;
}
function TooltipGlobal(props: Props) {
  return (
    <Tooltip content={props.text} color='primary' className="dark:text-white  ">
      {props.childrem}
    </Tooltip>
  );
}

export default TooltipGlobal;
