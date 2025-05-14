import { Button, Tab, Tabs } from '@heroui/react';
import { HandCoins, Plus, Settings } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import Layout from '../layout/Layout';

import AddInventaryAdjustment from '@/components/inventory_aqdjusment/AddInventaryAdjustment';
import useIsMobileOrTablet from '@/hooks/useIsMobileOrTablet';
import AddInventoryAdjustmentRecountStock from '@/components/inventory_aqdjusment/AddInventoryAdjustmentRecountStock';

function PurchaseOrders() {
  const [isOpenModalProduct, setIsOpenModalProduct] = useState(false);
  const [branchName, setBranchName] = useState('');

  const isMovil = useIsMobileOrTablet()

  return (
    <Layout title="Ajuste de Inventario">
      <>
        <div className="w-full h-full p-4 md:p-6  md:px-4 bg-gray-50 dark:bg-gray-800">
          <div className="w-full h-full flex flex-col p-3 border border-white rounded-xl overflow-y-auto bg-white custom-scrollbar shadow  dark:bg-gray-900 scrollbar-hide">
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
                  tab: 'bg-[#f4a261] text-white shadow py-1 h-full ',
                  tabContent: "text-white group-data-[selected=true]:text-[#f4a261]",
                }}
               variant="solid">
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
          </div>
        </div>
      </>
    </Layout>
  );
}

export default PurchaseOrders;
