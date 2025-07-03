import { Button, Tab, Tabs } from '@heroui/react';
import { HandCoins, Plus, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

// import Layout from '../layout/Layout';

import useIsMobileOrTablet from '@/hooks/useIsMobileOrTablet';
import DivGlobal from '@/themes/ui/div-global';

function PurchaseOrders() {
  const [isOpenModalProduct, setIsOpenModalProduct] = useState(false);
  const [branchName, setBranchName] = useState('');

  const isMovil = useIsMobileOrTablet()

  const location = useLocation();

  useEffect(() => {
    return () => {
      setIsOpenModalProduct(false);
      setBranchName('');
    };
  }, [location.pathname]);

  const navigate = useNavigate();

  const currentTab = location.pathname.endsWith('/recuento') ? 'recuento' : 'ajuste';
  const handleChange = (key: string) => {
    if (key === 'ajuste') navigate('/inventary-adjustment');
    else if (key === 'recuento') navigate('/inventary-adjustment/recuento');
    setBranchName('')
  };

  return (
    <>
      <>
        <DivGlobal>
          <div className="flex w-full flex-col">
            <div className="flex justify-end absolute right-8">
              <Button
                className="font-semibold "
                variant="bordered"
                onPress={() => {
                  if (branchName === '') {
                    toast.warning('Debes seleccionar una sucursal', { position: 'top-center' });
                  } else {
                    setIsOpenModalProduct(true);
                  }
                }}
              >
                {isMovil ? <Plus /> : 'Agregar Producto'}
              </Button>
            </div>

            <Tabs
              classNames={{
                tab: 'bg-white dark:bg-white/10 text-white shadow py-1 h-full ',
                tabList: 'bg-gray-100 border-2 border-indigo-100',
                tabContent: "text-[#f4a261] group-data-[selected=true]:text-white",
                cursor: 'bg-[#f4a261] dark:bg-[#f4a261]'
              }}
              selectedKey={currentTab}
              variant="bordered"
              onSelectionChange={(key) => handleChange(key as string)}
              >
              <Tab key="ajuste" title={<div  className='flex gap-1'><Settings /><span>Ajuste</span></div>} />
              <Tab key="recuento" title={<div className='flex gap-1'><HandCoins /><span>Recuento</span></div>} />
            </Tabs>
            <Outlet context={{
              isOpenModalProduct,
              setIsOpenModalProduct,
              branchName,
              setBranchName
            }} />

          </div>
        </DivGlobal>
      </>
    </>
  );
}

export default PurchaseOrders;
