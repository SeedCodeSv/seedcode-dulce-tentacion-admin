import { Accordion, AccordionItem, Input } from '@nextui-org/react';
import { ResumeShoppingProps } from '../types/shopping-manual.types';
import { useEffect, useState } from 'react';

function ResumeShopping({
  afecta,
  exenta,
  totalIva,
  $1perception,
  total,
  addItems,
}: ResumeShoppingProps) {
  const [inputValue, setInputValue] = useState(exenta);
  const [hasExenta, setHasExenta] = useState(false);
  const [exentaItemIndex, setExentaItemIndex] = useState<number | null>(null);

  useEffect(() => {
    const numericValue = parseFloat(inputValue) || 0;
  
    if (numericValue > 0) {
      if (!hasExenta) {
        // Solo agregar una nueva fila EXENTA si no existe una
        const debounceTimer = setTimeout(() => {
          const newItem = {
            no: 0,
            codCuenta: '',
            descCuenta: '',
            centroCosto: undefined,
            descTran: '', // No agregar "Exenta:" aquí, ya que no es necesario
            debe: numericValue.toString(),
            haber: '0',
            itemId: 0,
            isExenta: true,
          };
  
          addItems(newItem);
          setExentaItemIndex(0); // Asumimos que el nuevo ítem se agrega al principio
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
  }, [inputValue, addItems, hasExenta, exentaItemIndex]);

  useEffect(() => {
    setInputValue(exenta);
    if (parseFloat(exenta) === 0) {
      setHasExenta(false);
    }
  }, [exenta]);

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
                      label="AFECTA"
                      labelPlacement="outside"
                      placeholder="0.00"
                      variant="bordered"
                      classNames={{
                        label: 'font-semibold',
                        input: 'text-red-600 text-lg font-bold',
                      }}
                      readOnly
                      startContent={<span className="text-red-600 font-bold text-lg">$</span>}
                      value={afecta}
                    />
                  </div>
                  <div>
                    <Input
                      label="EXENTA"
                      labelPlacement="outside"
                      placeholder="0.00"
                      variant="bordered"
                      classNames={{
                        label: 'font-semibold',
                        input: 'text-red-600 text-lg font-bold',
                      }}
                      startContent={<span className="text-red-600 font-bold text-lg">$</span>}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      label="IVA"
                      labelPlacement="outside"
                      placeholder="0.00"
                      variant="bordered"
                      readOnly
                      classNames={{
                        label: 'font-semibold',
                        input: 'text-red-600 text-lg font-bold',
                      }}
                      startContent={<span className="text-red-600 font-bold text-lg">$</span>}
                      value={totalIva}
                    />
                  </div>
                  <div>
                    <Input
                      label="PERCEPCIÓN"
                      labelPlacement="outside"
                      placeholder="0.00"
                      variant="bordered"
                      classNames={{ label: 'font-semibold' }}
                      startContent="$"
                      type="number"
                      readOnly
                      value={$1perception.toFixed(2)}
                      step={0.01}
                    />
                  </div>
                  <div>
                    <Input
                      label="SUBTOTAL"
                      labelPlacement="outside"
                      placeholder="0.00"
                      variant="bordered"
                      classNames={{ label: 'font-semibold' }}
                      startContent="$"
                      readOnly
                      type="number"
                      value={afecta}
                      step={0.01}
                    />
                  </div>
                  <div>
                    <Input
                      label="TOTAL"
                      labelPlacement="outside"
                      placeholder="0.00"
                      variant="bordered"
                      classNames={{
                        label: 'font-semibold',
                        input: 'text-red-600 text-lg font-bold',
                      }}
                      startContent={<span className="text-red-600 font-bold text-lg">$</span>}
                      value={total}
                      readOnly
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