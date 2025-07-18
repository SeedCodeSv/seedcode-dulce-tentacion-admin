import { Accordion, AccordionItem, Input } from '@heroui/react';
import { useEffect, useState } from 'react';

import { ResumeShoppingProps } from './types/shopping-manual.types';

function EditResumeShopping({
  afecta,
  exenta,
  totalIva,
  $1perception,
  total,
  addItems,
  setExenta,
  items,
}: ResumeShoppingProps) {
  const [hasExenta, setHasExenta] = useState(false);
  const [exentaItemIndex, setExentaItemIndex] = useState<number | null>(null);

  useEffect(() => {
    const numericExenta = parseFloat(exenta) || 0;

    if (numericExenta > 0) {
      const existingExentaIndex = items.findIndex(
        (item) => parseFloat(item.debe) === numericExenta || item.isExenta
      );

      if (existingExentaIndex === -1) {
        // Si no existe una fila con `debe` igual a `exenta`, crear una nueva fila EXENTA
        const newItem = {
          no: items.length + 1,
          codCuenta: '',
          descCuenta: '',
          centroCosto: undefined,
          descTran: '',
          debe: exenta,
          haber: '0',
          itemId: 0,
          isExenta: true,
        };

        addItems(newItem);
        setExentaItemIndex(items.length); // Guardar el índice de la nueva fila exenta
        setHasExenta(true);
      } else {
        // Si ya existe una fila con `debe` igual a `exenta`, actualizarla
        const updatedItem = {
          ...items[existingExentaIndex],
          debe: exenta,
          isExenta: true, // Asegurarse de que la fila siga siendo exenta
        };

        addItems(updatedItem, existingExentaIndex);
        setExentaItemIndex(existingExentaIndex); // Actualizar el índice de la fila exenta
        setHasExenta(true);
      }
    } else if (hasExenta && exentaItemIndex !== null) {
      // Si el valor de `exenta` es 0 y hay una fila EXENTA, eliminarla
      addItems(undefined, exentaItemIndex);
      setHasExenta(false);
      setExentaItemIndex(null);
    }
  }, [exenta]);

  const handleExentaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    setExenta!(newValue);
  };

  return (
    <>
      <div className="w-full mt-4 border p-3 rounded-[12px]">
        <Accordion defaultExpandedKeys={['1']}>
          <AccordionItem
            key={'1'}
            textValue="Resumen"
            title={<p className="text-xl font-semibold">Resumen</p>}
          >
            <div>
              <div className="rounded border shadow dark:border-gray-700 p-5 md:p-10">
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <Input
                      readOnly
                      classNames={{
                        label: 'font-semibold',
                        input: 'text-red-600 text-lg font-bold',
                      }}
                      label="AFECTA"
                      labelPlacement="outside"
                      placeholder="0.00"
                      startContent={<span className="text-red-600 font-bold text-lg">$</span>}
                      value={afecta}
                      variant="bordered"
                    />
                  </div>
                  <div>
                    <Input
                      classNames={{
                        label: 'font-semibold',
                        input: 'text-red-600 text-lg font-bold',
                      }}
                      label="EXENTA"
                      labelPlacement="outside"
                      placeholder="0.00"
                      startContent={<span className="text-red-600 font-bold text-lg">$</span>}
                      value={exenta}
                      variant="bordered"
                      onChange={handleExentaChange}
                    />
                  </div>
                  <div>
                    <Input
                      readOnly
                      classNames={{
                        label: 'font-semibold',
                        input: 'text-red-600 text-lg font-bold',
                      }}
                      label="IVA"
                      labelPlacement="outside"
                      placeholder="0.00"
                      startContent={<span className="text-red-600 font-bold text-lg">$</span>}
                      value={totalIva}
                      variant="bordered"
                    />
                  </div>
                  <div>
                    <Input
                      readOnly
                      classNames={{ label: 'font-semibold' }}
                      label="PERCEPCIÓN"
                      labelPlacement="outside"
                      placeholder="0.00"
                      startContent="$"
                      step={0.01}
                      type="number"
                      value={$1perception.toFixed(2)}
                      variant="bordered"
                    />
                  </div>
                  <div>
                    <Input
                      readOnly
                      classNames={{ label: 'font-semibold' }}
                      label="SUBTOTAL"
                      labelPlacement="outside"
                      placeholder="0.00"
                      startContent="$"
                      step={0.01}
                      type="number"
                      value={afecta}
                      variant="bordered"
                    />
                  </div>
                  <div>
                    <Input
                      readOnly
                      classNames={{
                        label: 'font-semibold',
                        input: 'text-red-600 text-lg font-bold',
                      }}
                      label="TOTAL"
                      labelPlacement="outside"
                      placeholder="0.00"
                      startContent={<span className="text-red-600 font-bold text-lg">$</span>}
                      value={total}
                      variant="bordered"
                    />
                  </div>
                </div>
              </div>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}

export default EditResumeShopping;