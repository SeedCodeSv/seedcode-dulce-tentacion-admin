import { Helmet } from 'react-helmet-async';

import ListActionRol from '../components/action-rol/list-rol-actions';

import DivGlobal from '@/themes/ui/div-global';
function ActionRol() {
  return (
    <>
      <Helmet>
        <title>Permisos</title>
      </Helmet>
      <DivGlobal>
        <ListActionRol />
      </DivGlobal>
    </>
  );
}

export default ActionRol;
