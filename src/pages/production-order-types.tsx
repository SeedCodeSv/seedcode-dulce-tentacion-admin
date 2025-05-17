import { Plus } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useDisclosure } from '@heroui/react';

import Layout from '@/layout/Layout';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { useProductionOrderTypeStore } from '@/store/production-order-type.store';
import { usePermission } from '@/hooks/usePermission';
import AddProductionOrderType from '@/components/production-order-type/add-production-order-type';
import DivGlobal from '@/themes/ui/div-global';
import EmptyTable from '@/components/global/EmptyTable';
import { TableComponent } from '@/themes/ui/table-ui';

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
        <TableComponent
          headers={['Nº', 'Nombre', 'Acciones']}
        >
          {productionOrderTypes.length === 0 && (
            <tr>
              <td className="p-3" colSpan={3}>
                <EmptyTable />
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
        </TableComponent>
      </DivGlobal>
    </Layout>
  );
}

export default ProductionOrderTypes;
