import AccountingItems from './accounting-items';
import AddAccountingItems from './add-accounting-items';
import TypeAccountingItem from './type-accounting-item';

export default [
  {
    path: '/accounting-items',
    element: <AccountingItems />,
  },
  {
    path: '/add-accounting-items',
    element: <AddAccountingItems />,
  },
  {
    path: '/type-accounting',
    element: <TypeAccountingItem />,
  },
];
