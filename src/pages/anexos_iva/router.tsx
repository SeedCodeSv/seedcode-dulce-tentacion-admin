import AnexoCcfe from './anexo_ccfe';
import AnexoFe from './anexo_fe';
import AnexosCompras from './anexos_compras';

export default [
  {
    path: '/anexos-iva-compras',
    element: <AnexosCompras />,
  },
  {
    path: '/anexos-fe',
    element: <AnexoFe />,
  },
  {
    path: '/anexos-ccfe',
    element: <AnexoCcfe />,
  },
];
