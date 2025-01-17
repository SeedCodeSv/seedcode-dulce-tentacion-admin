import AddSettlementDocument from "./add-settlement-document";
import SettlementDocument from "./settlement-document";

const routes = [
  {
    path: '/settlement-document',
    element: <SettlementDocument />,
  },
  {
    path: '/add-settlement-document',
    element: <AddSettlementDocument />,
  },
];

export default routes