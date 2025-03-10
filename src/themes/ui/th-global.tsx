import { ThemeContext } from '@/hooks/useTheme';
import React, { useContext } from 'react';

interface Props extends React.ThHTMLAttributes<HTMLTableCellElement> {}

function ThGlobal(props: Props) {
  const { theme, context } = useContext(ThemeContext);
  return (
    <th
      style={{
        color: theme.colors[context].table.textColor,
        backgroundColor: theme.colors[context].table.background,
      }}
      {...props}
    >
      {props.children}
    </th>
  );
}

export default ThGlobal;
