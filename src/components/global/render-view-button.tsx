import { ButtonGroup } from '@heroui/react';
import { CreditCard, List, Table } from 'lucide-react';

import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

interface Props {
  view: 'table' | 'grid' | 'list';
  setView: (view: 'table' | 'grid' | 'list') => void;
  isList?: boolean
}

function RenderViewButton({ view, setView, isList = false}: Props) {
  return (
    <ButtonGroup>
      <ButtonUi
        isIconOnly
        theme={view === 'table' ? Colors.Primary : Colors.Default}
        onPress={() => setView('table')}
      >
        <Table />
      </ButtonUi>
      <ButtonUi
        isIconOnly
        theme={view === 'grid' ? Colors.Primary : Colors.Default}
        onPress={() => setView('grid')}
      >
        <CreditCard />
      </ButtonUi>
      {isList &&
        <ButtonUi
          isIconOnly
          theme={view === 'list' ? Colors.Primary : Colors.Default}
          onPress={() => setView('list')}
        >
          <List />
        </ButtonUi>
      }
    </ButtonGroup>
  );
}

export default RenderViewButton;
