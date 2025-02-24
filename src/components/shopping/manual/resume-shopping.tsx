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

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (inputValue && !hasExenta) {
        // Solo agregar si no hay una fila de EXENTA
        const numericValue = parseFloat(inputValue) || 0;

        // Si el valor es mayor que 0, agregar un item específico para EXENTA
        if (numericValue > 0) {
          addItems({
            no: 0,
            codCuenta: '',
            descCuenta: '',
            centroCosto: undefined,
            descTran: `Exenta: ${numericValue}`,
            debe: numericValue.toString(),
            haber: '0',
            itemId: 0,
          });

          setHasExenta(true);
          // setInputValue('');
        }
      }
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [inputValue, addItems, hasExenta]);

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
                      isDisabled={hasExenta}
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
