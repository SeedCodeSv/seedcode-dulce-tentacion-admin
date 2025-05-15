import { DetailedHTMLProps, TdHTMLAttributes, useContext } from 'react';

import { ThemeContext } from '@/hooks/useTheme';

interface Props
  extends DetailedHTMLProps<TdHTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement> {}

function TdGlobal(props: Props) {
  const { theme, context } = useContext(ThemeContext);

  return (
    <td style={{ ...props.style, color: theme.colors[context].textColor }} {...props}>
      {props.children}
    </td>
  );
}

export default TdGlobal;
