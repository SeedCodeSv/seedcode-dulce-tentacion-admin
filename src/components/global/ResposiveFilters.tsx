import { Button } from '@heroui/react';
import { Filter } from 'lucide-react';
import { ReactNode, useState } from 'react';

import BottomDrawer from './BottomDrawer';

import { global_styles } from '@/styles/global.styles';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import useIsMobileOrTablet from '@/hooks/useIsMobileOrTablet';

interface Props {
  onApply?: () => void
  children: ReactNode
  applyLabel?: string
  buttonLabel?: string
  withButton?: boolean
}

export const ResponsiveFilterWrapper = ({
  onApply,
  children,
  applyLabel = 'Aplicar',
  buttonLabel = 'Buscar',
  withButton = true
}: Props) => {

  const isMobile = useIsMobileOrTablet();

  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="flex items-end gap-5">
        <ButtonUi
          isIconOnly showTooltip className="xl:hidden"
          theme={Colors.Info}
          tooltipText='Buscar por filtros'
          onPress={() => setOpen(true)}
        >
          <Filter />
        </ButtonUi>

        <BottomDrawer open={open} title="Filtros disponibles" onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-3">
            {children}
            {withButton &&
              <Button
                className="font-semibold"
                color="primary"
                style={global_styles().darkStyle}
                onPress={() => {
                  onApply!();
                  setOpen(false);
                }}
              >
                {applyLabel}
              </Button>
            }
          </div>
        </BottomDrawer>
      </div>
    );
  }

  return (
    <div className="w-full hidden gap-5 xl:flex">
      <div className="flex justify-between gap-5 w-full items-end">
        {children}
        {withButton &&
          <ButtonUi
            className="px-5 font-semibold"
            theme={Colors.Info}
            onPress={onApply}
          >
            {buttonLabel}
          </ButtonUi>
        }
      </div>
    </div>
  );
};
