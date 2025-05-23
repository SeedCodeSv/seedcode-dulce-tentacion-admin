import { Filter } from 'lucide-react';
import { ReactNode, useState } from 'react';

import BottomDrawer from './BottomDrawer';

import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import useIsMobileOrTablet from '@/hooks/useIsMobileOrTablet';

interface Props {
  onApply?: () => void
  children: ReactNode
  applyLabel?: string
  buttonLabel?: string
  withButton?: boolean
  showSearchButton?: boolean;
  showApplyButton?: boolean;
  classLg?: string
  classButtonLg?: string
}

export const ResponsiveFilterWrapper = ({
  onApply,
  children,
  applyLabel = 'Aplicar',
  buttonLabel = 'Buscar',
  withButton = true,
  showApplyButton = true,
  showSearchButton = true,
  classLg,
  classButtonLg
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
            {withButton && showApplyButton &&
              <ButtonUi
                className="font-semibold"
                theme={Colors.Info}
                onPress={() => {
                  onApply!();
                  setOpen(false);
                }}
              >
                {applyLabel}
              </ButtonUi>
            }
          </div>
        </BottomDrawer>
      </div>
    );
  }

  return (
    <div className="w-full hidden gap-5 md:flex">
      <div className={classLg ?? "flex justify-between gap-5 w-full items-end"}>
        {children}
        {withButton && showSearchButton &&
          <ButtonUi
            className={`px-5 font-semibold ${classButtonLg}`}
            
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
