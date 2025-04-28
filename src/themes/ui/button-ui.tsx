import { Button, ButtonProps, Tooltip } from '@heroui/react';

import useThemeColors from '../use-theme-colors';

import { Colors } from '@/types/themes.types';
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
        <Tooltip className="dark:text-white" content={props.tooltipText}>
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
