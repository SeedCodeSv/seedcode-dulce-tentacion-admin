import AccountingItems from './accounting-items';
import AddAccountingItems from './add-accounting-items';
import AddItemsBySales from './add-items-by-sales';
import EditAccountingItems from './edit-accounting-items';
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
    path: '/add-item-by-sales',
    element: <AddItemsBySales />,
  },
  {
    path: '/edit-accounting-items/:id',
    element: <EditAccountingItems />,
  },
  {
    path: '/type-accounting',
    element: <TypeAccountingItem />,
  },
];
