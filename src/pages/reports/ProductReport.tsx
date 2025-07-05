
import { Tab, Tabs } from '@heroui/react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { startTransition } from 'react';
import React from 'react';

import { useViewsStore } from '@/store/views.store';
import DivGlobal from '@/themes/ui/div-global';

export default function ProductSalesReportPage() {
  const { actions } = useViewsStore();
  const categoriasView = actions.find((view) => view.view.name === 'Ventas por Productos');
  const actionView = categoriasView?.actions?.name || [];

  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = location.pathname === "/reports/sales-by-product/detailed-branches"
    ? "detailed-branches"
    : "summary";


  const handleChange = (key: string) => {
    startTransition(() => {
      if (key === "summary") navigate("/reports/sales-by-product");
      else if (key === "detailed-branches") navigate("/reports/sales-by-product/detailed-branches");
    });
  };


  return (
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
        <Tab key="summary" title="Resumen" />
        <Tab key="detailed-branches" title="Detallado por sucursales" />
      </Tabs>

      <React.Suspense fallback={<div>Cargando vista...</div>}>
        <Outlet context={{ actionView }} />
      </React.Suspense>
    </DivGlobal>
  );
}
