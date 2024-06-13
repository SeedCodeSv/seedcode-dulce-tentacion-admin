import Layout from '../layout/Layout';
import ListCreditCustomers from '../components/credit-sales/ListCreditCustomers';
// import { useContext, useMemo } from 'react';
// import { ActionsContext } from '../hooks/useActions';
// import { filterActions } from '../utils/filters';

function CreditCustomers() {
  // const { roleActions } = useContext(ActionsContext);

  // const actions_role_view = useMemo(() => {
  //   if (roleActions) {
  //     const actions = filterActions('Creditos de clientes', roleActions)?.actions.map(
  //       (re) => re.name
  //     );
  //     return actions;
  //   }
  //   return undefined;
  // }, [roleActions]);

  return (
    <Layout title="Creditos de clientes">

      <ListCreditCustomers />

    </Layout>
  );
}

export default CreditCustomers;
