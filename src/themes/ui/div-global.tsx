import React, { DetailedHTMLProps, HTMLAttributes, useContext } from 'react';

import { ThemeContext } from '@/hooks/useTheme';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: React.ReactNode;
}

function DivGlobal({ children, className}: Props) {
  const { theme, context } = useContext(ThemeContext);
  console.log(theme.colors[context].background)

  return (
    <div
      className={className ?? "pt-9 w-full h-full flex flex-col overflow-y-auto p-5 xl:p-8"}
      style={{ background: theme.colors[context].background }}
    >
      {children}
    </div>
  );
}

export default DivGlobal;
