import { useContext } from 'react';

import Layout from '../layout/Layout';
import ERROR404 from '../assets/page_not_found.png';

import { ThemeContext } from '@/hooks/useTheme';

function Error404() {
   const { theme, context } = useContext(ThemeContext);
  
  return (
    <Layout title="Pagina no encontrada">
      <div className="flex items-center justify-center w-full h-full overflow-y-hidden"
      style={{ background: theme.colors[context].background }}
      >
        <img alt="404" src={ERROR404} />
      </div>
    </Layout>
  );
}

export default Error404;
