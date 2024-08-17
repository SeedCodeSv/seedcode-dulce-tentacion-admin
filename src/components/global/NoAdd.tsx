import { Button } from '@nextui-org/react';
import { Lock } from 'lucide-react';
import { useContext } from 'react';
import { ThemeContext } from '../../hooks/useTheme';
function NotAddButton() {
  const { theme } = useContext(ThemeContext);
  const { colors } = theme;

  const style = {
    backgroundColor: colors.third,
    color: colors.primary,
  };
  return (
    <>
      <Button
        endContent={<Lock size={20} />}
        style={{ ...style, cursor: 'not-allowed' }}
        className="hidden font-semibold md:flex"
        type="button"
        disabled
      >
        {'Agregar nuevo'}
      </Button>

      <Button
        type="button"
        disabled
        style={{ ...style, cursor: 'not-allowed' }}
        className="flex font-semibold md:hidden"
        isIconOnly
      >
        <Lock />
      </Button>
    </>
  );
}

export default NotAddButton;
