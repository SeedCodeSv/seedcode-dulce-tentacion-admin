import { Tab, Tabs } from '@heroui/react';
import { Outlet, useLocation, useNavigate } from 'react-router';

import DivGlobal from '@/themes/ui/div-global';

export default function OrdenProductionReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const handleChange = (key: string) => {
    if (key === 'general') navigate('/OP-report');
    else if (key === 'by-product') navigate('/OP-report/by-product');
  };
  const currentTab = location.pathname === '/OP-report/by-product' ? 'by-product' : 'general';

  return (
    <>
      <DivGlobal>
        <Tabs
          className="mb-4"
          classNames={{
            tab: 'text-white shadow py-1 h-full ',
            tabList: 'bg-slate-100/20 border dark:border-gray-500',
            tabContent: 'text-gray-900 group-data-[selected=true]:text-white dark:text-white',
            cursor: 'bg-blue-500 dark:bg-blue-700',
          }}
          radius="md"
          selectedKey={currentTab}
          variant="bordered"
          onSelectionChange={(key) => handleChange(key as string)}
        >
          <Tab key="general" title="General" />
          <Tab key="by-product" title="Detallado por producto" />
        </Tabs>
        <Outlet />
      </DivGlobal>
    </>
  );
}
