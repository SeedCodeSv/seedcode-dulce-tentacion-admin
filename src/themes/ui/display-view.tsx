import { ButtonGroup } from '@heroui/react';
import { CreditCard, Table } from 'lucide-react';

import ButtonUi from './button-ui';

import { Colors } from '@/types/themes.types';

interface Props {
    view: "table" | "grid";
    setView: (view: "table" | "grid") => void;
}

function DisplayView({ view, setView }: Props) {
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
    </ButtonGroup>
  );
}

export default DisplayView;
