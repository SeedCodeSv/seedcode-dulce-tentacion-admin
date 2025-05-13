import React, { useEffect, useMemo, useState } from 'react';
import { Printer, Save } from 'lucide-react';
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from '@heroui/react';

import OrderHeader from './order-header';
import OrderDetails from './order-details';
import ProductsList from './products-list';
import CompletionNotes from './completion-notes';
import Button from './ui/button';

import { useProductionOrderStore } from '@/store/production-order.store';

interface Product {
  id: string;
  name: string;
  code: string;
  expectedQuantity: number;
  unit: string;
  producedQuantity?: number;
  damagedQuantity?: number;
}

const CompleteOrder: React.FC = () => {
  const { productionOrderDetail, getProductionsOrderDetail } = useProductionOrderStore();

  useEffect(() => {
    getProductionsOrderDetail(2);
  }, []);

  // const [setCompletionNotes] = useState<string>('');
  const [products] = useState<Product[]>([
    {
      id: 'TORT8011',
      name: 'Torta de chocolate',
      code: 'TORT8011',
      expectedQuantity: 250,
      unit: 'Unidad',
    },
    {
      id: 'PVE040',
      name: 'Pastel Vegano',
      code: 'PVE040',
      expectedQuantity: 250,
      unit: 'Unidad',
    },
  ]);



  const handleNotesChange = (notes: string) => {
    // setCompletionNotes(notes);
    alert(notes);
  };

  const handleSubmit = () => {
    // Here would go the logic to submit the finalized order

    alert('Orden finalizada con éxito');
  };

  const handlePrint = () => {
    window.print();
  };

  const allProductsComplete = products.every(
    (product) =>
      (product.producedQuantity || 0) + (product.damagedQuantity || 0) >= product.expectedQuantity
  );

  const employeeName = useMemo(() => {
    if (productionOrderDetail) {
      return `${productionOrderDetail.employee.firstName} ${productionOrderDetail.employee.secondName} ${productionOrderDetail.employee.firstLastName} ${productionOrderDetail.employee.secondLastName}`;
    }

    return '';
  }, [productionOrderDetail]);

  return (
    <Drawer isOpen scrollBehavior="inside" size="full">
      <DrawerContent>
        <DrawerHeader>
          <h1 className="text-2xl font-bold text-gray-800">Finalizar orden de producción</h1>
        </DrawerHeader>
        <DrawerBody>
          {productionOrderDetail && (
            <div className=" py-8 px-4">
              <div className="bg-white rounded-lg shadow p-6 mb-6 print:shadow-none">
                <OrderHeader
                  category={productionOrderDetail.productionOrderType.name}
                  orderNumber={productionOrderDetail.id.toString()}
                  status={productionOrderDetail.statusOrder}
                />

                <OrderDetails
                  creationDate={
                    productionOrderDetail?.date || '' + ' : ' + productionOrderDetail?.time || ''
                  }
                  destinationBranch={productionOrderDetail?.destinationBranch.name || ''}
                  employee={employeeName}
                  observations={JSON.parse(productionOrderDetail?.moreInformation || '[]')}
                  receptionBranch={productionOrderDetail?.receptionBranch.name || ''}
                />

                <ProductsList
                  products={productionOrderDetail.details.map((detail) => ({
                    ...detail,
                    producedQuantity: 0,
                    damagedQuantity: 0,
                    expectedQuantity: 0,
                  }))}
                  onProductUpdate={()=> {}}
                />

                <CompletionNotes onNotesChange={handleNotesChange} />
              </div>
            </div>
          )}
        </DrawerBody>
        <DrawerFooter className="w-full">
          <div className="w-full flex justify-between mt-8 print:hidden">
            <div className="flex space-x-4">
              <Button variant="secondary" onClick={handlePrint}>
                <Printer className="w-5 h-5 mr-2" />
                Imprimir resumen
              </Button>
            </div>
            <div className="flex space-x-4">
              <Button variant="secondary">Cancelar</Button>
              <Button disabled={!allProductsComplete} variant="success" onClick={handleSubmit}>
                <Save className="w-5 h-5 mr-2" />
                Finalizar orden
              </Button>
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CompleteOrder;
