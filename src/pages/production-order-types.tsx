import { Plus } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useDisclosure } from '@heroui/react';

import Layout from '@/layout/Layout';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { useProductionOrderTypeStore } from '@/store/production-order-type.store';
import { usePermission } from '@/hooks/usePermission';
import ThGlobal from '@/themes/ui/th-global';
import EmptyBox from '@/assets/empty-box.png';
import AddProductionOrderType from '@/components/production-order-type/add-production-order-type';

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
      <div className=" w-full h-full flex flex-col overflow-y-auto p-5 lg:p-8 bg-gray-50 dark:bg-gray-900">
        <div className="w-full flex justify-end">
          {actions.includes('Agregar') && (
            <>
            <AddProductionOrderType disclosure={addModalDisclosure} />
            <ButtonUi isIconOnly theme={Colors.Success} onPress={addModalDisclosure .onOpen}>
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
                    <div className="flex flex-col justify-center items-center h-full">
                      <img alt="NO DATA" className="w-40" src={EmptyBox} />
                      <p className="text-lg font-semibold mt-3 dark:text-white">
                        No se encontraron resultados
                      </p>
                    </div>
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
      </div>
    </Layout>
  );
}

export default ProductionOrderTypes;
