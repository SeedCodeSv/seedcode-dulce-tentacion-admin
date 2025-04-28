import React, { useContext } from 'react';

import { ThemeContext } from '@/hooks/useTheme';

interface PuiProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  > {
  children: React.ReactNode;
}

function Pui({ children, ...props }: PuiProps) {
  const { theme, context } = useContext(ThemeContext);

  return (
    <p
      {...props}
      style={{
        ...props.style,
        color: theme.colors[context].textColor
      }}
    >
      {children}
    </p>
  );
}

export default Pui;
