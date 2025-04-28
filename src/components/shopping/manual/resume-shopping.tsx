import { Accordion, AccordionItem, Input } from "@heroui/react";
import { useEffect, useState } from 'react';

import { ResumeShoppingProps } from '../types/shopping-manual.types';

function ResumeShopping({
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

  // Encuentra la fila EXENTA en la lista de ítems
  useEffect(() => {
    if (items && items.length > 0) {
      const index = items.findIndex((item) => item.isExenta === true);

      if (index !== -1) {
        setExentaItemIndex(index);
        setHasExenta(true);
      } else {
        setExentaItemIndex(null);
        setHasExenta(false);
      }
    }
  }, [items]);

  // Actualiza el valor de `debe` en la fila EXENTA cuando cambia `exenta`
  useEffect(() => {
    if (exentaItemIndex !== null && items && items[exentaItemIndex]) {
      const currentExentaValue = items[exentaItemIndex].debe;

      // Solo actualiza si el valor de `exenta` es diferente al valor actual en la fila EXENTA
      if (currentExentaValue !== exenta) {
        const updatedItem = {
          ...items[exentaItemIndex],
          debe: exenta,
        };

        addItems(updatedItem, exentaItemIndex);
      }
    }
  }, [exenta, exentaItemIndex, items, addItems]);

  const handleExentaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    setExenta!(newValue);
  };

  useEffect(() => {
    const numericValue = parseFloat(exenta) || 0;

    if (numericValue > 0) {
      if (!hasExenta) {
        // Solo agregar una nueva fila EXENTA si no existe una
        const debounceTimer = setTimeout(() => {
          const newItem = {
            no: 0,
            codCuenta: '',
            descCuenta: '',
            centroCosto: undefined,
            descTran: '',
            debe: numericValue.toString(),
            haber: '0',
            itemId: 0,
            isExenta: true,
          };

          addItems(newItem);
          setExentaItemIndex(0);
          setHasExenta(true);
        }, 1000);

        return () => clearTimeout(debounceTimer);
      }
    } else if (hasExenta && exentaItemIndex !== null) {
      // Si el valor es 0 y hay una fila EXENTA, eliminarla
      addItems(undefined, exentaItemIndex);
      setHasExenta(false);
      setExentaItemIndex(null);
    }
  }, [exenta, addItems, hasExenta, exentaItemIndex]);

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

export default ResumeShopping;
