import { Tab, Tabs } from '@heroui/react';
import { Outlet, useLocation, useNavigate } from 'react-router';

import { useViewsStore } from '@/store/views.store';
import DivGlobal from '@/themes/ui/div-global';


export default function ProductSelledReportPage() {
  const { actions } = useViewsStore();
  const categoriasView = actions.find((view) => view.view.name === 'Productos Vendidos');
  const actionView = categoriasView?.actions?.name || [];

  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = location.pathname === "/products-selled/detailed" ? "detailed" : "general";

  const handleChange = (key: string) => {
    if (key === "general") navigate("/products-selled");
    else if (key === "detailed") navigate("/products-selled/detailed");
  };

  return (
    <>
      <DivGlobal>
        <Tabs
          className="mb-4"
          classNames={{
            tab: 'text-white shadow py-1 h-full ',
            tabList: 'bg-slate-100 border dark:border-gray-500',
            tabContent: "text-gray-900 group-data-[selected=true]:text-white dark:text-white",
            cursor: 'bg-blue-500 dark:bg-blue-700'
          }}
          radius="md"
          selectedKey={currentTab}
          variant="bordered"
          onSelectionChange={(key) => handleChange(key as string)}
        >
          <Tab key="detailed" title="Detallado" />
          <Tab key="general" title="Resumen" />
        </Tabs>
        <Outlet context={{ actionView }} />
      </DivGlobal>
    </>
  );
}
