import { Button, Tab, Tabs } from '@heroui/react';
import { HandCoins, Plus, Settings } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import Layout from '../layout/Layout';

import AddInventaryAdjustment from '@/components/inventory_aqdjusment/AddInventaryAdjustment';
import useIsMobileOrTablet from '@/hooks/useIsMobileOrTablet';
import AddInventoryAdjustmentRecountStock from '@/components/inventory_aqdjusment/AddInventoryAdjustmentRecountStock';
import DivGlobal from '@/themes/ui/div-global';

function PurchaseOrders() {
  const [isOpenModalProduct, setIsOpenModalProduct] = useState(false);
  const [branchName, setBranchName] = useState('');

  const isMovil = useIsMobileOrTablet()

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
                      toast.warning('Debes seleccionar una sucursal', {position: 'top-center'});
                    } else {
                      setIsOpenModalProduct(true);
                    }
                  }}
                >
                  {isMovil ? <Plus/> : 'Agregar Producto'}
                </Button>
              </div>

              <Tabs aria-label="Options" 
                classNames={{
                  tab: 'bg-white dark:bg-white/10 text-white shadow py-1 h-full ',
                  tabList:'bg-gray-100 border-2 border-indigo-100',
                  tabContent: "text-[#f4a261] group-data-[selected=true]:text-white",
                  cursor: 'bg-[#f4a261] dark:bg-[#f4a261]'
                }}
               variant="bordered">
                <Tab
                  key="photos"
                  title={
                    <div className="flex items-center space-x-2">
                      <Settings />
                      <span>Ajuste</span>
                    </div>
                  }
                >
                  <AddInventaryAdjustment
                    branchName={(e) => setBranchName(e)}
                    closeModal={() => setIsOpenModalProduct(false)}
                    isOpen={isOpenModalProduct}
                  />
                </Tab>
                <Tab
                  key="music"
                  title={
                    <div className="flex items-center space-x-2">
                      <HandCoins />
                      <span>Recuento</span>
                    </div>
                  }
                >
                  <AddInventoryAdjustmentRecountStock
                    branchName={(e) => setBranchName(e)}
                    closeModal={() => setIsOpenModalProduct(false)}
                    isOpen={isOpenModalProduct}
                  />
                </Tab>
              </Tabs>
            </div>
          </DivGlobal>
      </>
    </>
  );
}

export default PurchaseOrders;
