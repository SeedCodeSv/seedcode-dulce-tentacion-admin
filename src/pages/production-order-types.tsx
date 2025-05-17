import { Plus } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useDisclosure } from '@heroui/react';

import Layout from '@/layout/Layout';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { useProductionOrderTypeStore } from '@/store/production-order-type.store';
import { usePermission } from '@/hooks/usePermission';
import ThGlobal from '@/themes/ui/th-global';
import AddProductionOrderType from '@/components/production-order-type/add-production-order-type';
import DivGlobal from '@/themes/ui/div-global';
import EmptyTable from '@/components/global/EmptyTable';

function ProductionOrderTypes() {
  const { roleActions, returnActionsByView } = usePermission();

  const actions = useMemo(
    () => returnActionsByView('Tipos de ordenes de producción'),
    [roleActions]
  );

  const { productionOrderTypes, onGetProductionOrderTypes } = useProductionOrderTypeStore();

  useEffect(() => {
    onGetProductionOrderTypes();
  }, []);

  const addModalDisclosure = useDisclosure();

  return (
    <Layout title="Tipos de Ordenes de Producción">
      <DivGlobal className="flex flex-col h-full overflow-y-auto ">
        <div className="w-full flex justify-end">
          {actions.includes('Agregar') && (
            <>
              <AddProductionOrderType disclosure={addModalDisclosure} />
              <ButtonUi isIconOnly theme={Colors.Success} onPress={addModalDisclosure.onOpen}>
                <Plus />
              </ButtonUi>
            </>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
          <table className="w-full">
            <thead className="sticky top-0 z-20 bg-white">
              <tr>
                <ThGlobal className="text-left p-3">No.</ThGlobal>
                <ThGlobal className="text-left p-3">Nombre</ThGlobal>
                <ThGlobal className="text-left p-3">Acciones</ThGlobal>
              </tr>
            </thead>
            <tbody>
              {productionOrderTypes.length === 0 && (
                <tr>
                  <td className="p-3" colSpan={3}>
                   <EmptyTable/>
                  </td>
                </tr>
              )}
              {productionOrderTypes.map((productionOrderType, index) => (
                <tr key={index}>
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{productionOrderType.name}</td>
                  <td className="p-3">Acciones</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DivGlobal>
    </Layout>
  );
}

export default ProductionOrderTypes;
