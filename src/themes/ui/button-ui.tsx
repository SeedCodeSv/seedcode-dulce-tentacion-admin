import { Colors } from '@/types/themes.types';
import { Button, ButtonProps, Tooltip } from '@heroui/react';
import useThemeColors from '../use-theme-colors';
interface CustomButtonProps extends ButtonProps {
  theme: Colors;
  showTooltip?: boolean;
  tooltipText?: string;
}
function ButtonUi(props: CustomButtonProps) {
  const style = useThemeColors({ name: props.theme });
  return (
    <>
      {props.showTooltip ? (
        <Tooltip content={props.tooltipText} className="dark:text-white">
          <Button style={style} {...props}>
            {props.children}
          </Button>
        </Tooltip>
      ) : (
        <Button style={style} {...props}>
          {props.children}
        </Button>
      )}
    </>
  );
}

export default ButtonUi;
