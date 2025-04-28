import { Plus } from 'lucide-react';

import { Colors } from '@/types/themes.types';
import ButtonUi from '@/themes/ui/button-ui';

interface Props {
  onClick: () => void;
  text?: string;
}

function AddButton(props: Props) {
  return (
    <>
      <ButtonUi isIconOnly theme={Colors.Success} onPress={props.onClick}>
        <Plus />
      </ButtonUi>
    </>
  );
}

export default AddButton;
