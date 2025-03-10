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
      <ButtonUi onPress={props.onClick} theme={Colors.Success} isIconOnly>
        <Plus />
      </ButtonUi>
    </>
  );
}

export default AddButton;
