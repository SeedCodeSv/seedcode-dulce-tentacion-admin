import React, { DetailedHTMLProps, HTMLAttributes, useContext } from 'react';

import { ThemeContext } from '@/hooks/useTheme';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: React.ReactNode;
}

function DivGlobal({ children }: Props) {
  const { theme, context } = useContext(ThemeContext);

  return (
    <div
      className="pt-9 w-full h-full flex flex-col overflow-y-auto p-5 lg:p-8"
      style={{ background: theme.colors[context].background }}
    >
      {children}
    </div>
  );
}

export default DivGlobal;
