import {
  Accordion,
  AccordionItem,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import classNames from 'classnames';
import { useEffect } from 'react';
import { Plus, Trash } from 'lucide-react';

import { AccountItemProps } from '../types/shopping-manual.types';

import { CodCuentaSelect } from './cod-cuenta-select';

import { useTypeOfAccountStore } from '@/store/type-of-aacount.store';
import ThGlobal from '@/themes/ui/th-global';
import { Colors } from '@/types/themes.types';
import ButtonUi from '@/themes/ui/button-ui';

function AccountItem({
  items,
  setItems,
  selectedIndex,
  setSelectedIndex,
  openCatalogModal,
  onClose,
  branchName,
  $debe,
  $haber,
  $total,
  description,
  setDescription,
  date,
  setDate,
  selectedType,
  setSelectedType,
  addItems,
  ivaShoppingCod,
  isReadOnly,
  editAccount,
  setExenta,
  setErrorP,
  errorP
}: AccountItemProps) {
  const { list_type_of_account, getListTypeOfAccount } = useTypeOfAccountStore();

  const handleChangeDes = (text: string) => {
    setDescription(text);
    const newItems = items.map((item) => {
      if (item.isExenta) {
        return item;
      }

      return {
        ...item,
        descTran: text,
      };
    });

    setItems(newItems);
  };

  useEffect(() => {
    getListTypeOfAccount();
  }, []);

  useEffect(() => {
    if (list_type_of_account.length > 0) {
      const find = list_type_of_account.find((w) => w.name.toLocaleLowerCase().includes('compras'));

      setSelectedType(find?.id ?? 0);
    }
  }, [list_type_of_account]);

  const handleInputChange = (index: number, field: 'debe' | 'haber', value: string) => {
    const inputValue = value.replace(/[^0-9.]/g, ''); // Filtra el valor para permitir solo números y puntos
    const updatedItems = [...items]; // Crea una copia del estado actual
    const currentItem = updatedItems[index];

    // Actualiza el campo correspondiente
    currentItem[field] = inputValue;

    // Limpia el campo opuesto si el valor es mayor que 0
    if (Number(inputValue) > 0) {
      currentItem[field === 'debe' ? 'haber' : 'debe'] = '';
    }

    // Si es una fila EXENTA y el valor es 0, no resetear la descripción
    if (currentItem.isExenta && inputValue === '') {
      currentItem.descTran = 'Exenta: ';
    }

    // Calcula el total excluyendo el último y penúltimo elemento
    const total = updatedItems
      .slice(0, -2) // Excluye los últimos dos elementos
      .filter(item => !item.isExenta) // Excluye las filas EXENTA
      .map((item) => Number(item.debe) + Number(item.haber))
      .reduce((a, b) => a + b, 0);

    const result = Number(total.toFixed(2)); // Redondea a 2 decimales
    const iva13 = Number((result * 0.13).toFixed(2)); // Calcula el IVA del 13%

    // Actualiza el penúltimo elemento (IVA)
    updatedItems[updatedItems.length - 2].debe = iva13.toFixed(2);
    updatedItems[updatedItems.length - 2].haber = '0';

    updatedItems[updatedItems.length - 1].haber = (result + iva13).toFixed(2);
    updatedItems[updatedItems.length - 1].debe = '0';

    setItems(updatedItems);
  };

  const handleRemove = (index: number) => {
    // Filtra el ítem a eliminar y excluye el último y penúltimo elemento
    const newItems = items.filter((_, i) => i !== index && i < items.length - 2);

    // Si la fila eliminada es EXENTA, actualizar el estado $exenta a '0'
    if (items[index].isExenta == true) {
      setExenta!('0');
    }

    const total = newItems
      .map((item) => Number(item.debe) + Number(item.haber))
      .reduce((a, b) => a + b, 0);

    const iva13 = Number((total * 0.13).toFixed(2)); // Calcula el IVA del 13%

    const lastItem = items[items.length - 1];
    const prevItem = items[items.length - 2];

    newItems.push(
      { ...prevItem, debe: iva13.toFixed(2), haber: '0' },
      { ...lastItem, debe: '0', haber: (total + iva13).toFixed(2) } // Último elemento (total + IVA)
    );

    setItems(newItems);
  };

  return (
    <>
      <div
        className={`w-full mt-4 p-3 rounded-[12px] shadow ${errorP ? 'border-2 border-red-300' : 'border'
          }`}
      >
        <Accordion
          onSelectionChange={() => {
            if (setErrorP) {
              setErrorP(false);
            }
          }}
        >
          <AccordionItem
            key="1"
            textValue="Partida contable"
            title={<p className="text-xl font-semibold">Partida contable</p>}
          >
            <div>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  classNames={{
                    base: 'font-semibold',
                  }}
                  label="Fecha de la partida"
                  labelPlacement="outside"
                  readOnly={isReadOnly}
                  type="date"
                  value={date}
                  variant="bordered"
                  onChange={(e) => setDate(e.target.value)}
                />
                <Select
                  classNames={{
                    base: 'font-semibold',
                  }}
                  isDisabled={isReadOnly}
                  label="Tipo de partida"
                  labelPlacement="outside"
                  placeholder="Selecciona el tipo de partida"
                  selectedKeys={selectedType > 0 ? [selectedType.toString()] : []}
                  variant="bordered"
                  onSelectionChange={(key) => {
                    if (key) {
                      setSelectedType(Number(key.currentKey));
                    }
                  }}
                >
                  {list_type_of_account.map((type) => (
                    <SelectItem key={type.id} textValue={type.name}>
                      {type.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="mt-3">
                <Textarea
                  classNames={{
                    base: 'font-semibold',
                  }}
                  isReadOnly={isReadOnly}
                  label="Concepto de la partida"
                  labelPlacement="outside"
                  placeholder="Ingresa el concepto de la partida"
                  value={description}
                  variant="bordered"
                  onValueChange={handleChangeDes}
                />
              </div>
              <div className="w-full flex justify-end py-3">
                <ButtonUi isIconOnly theme={Colors.Success} onPress={addItems}>
                  <Plus size={20} />
                </ButtonUi>
              </div>
              <div className="overflow-x-auto flex flex-col h-full custom-scrollbar">
                <table className="w-full">
                  <thead className="sticky top-0 z-20 bg-white">
                    <tr>
                      <ThGlobal className="text-left p-3">Código</ThGlobal>
                      <ThGlobal className="text-left p-3">Centro Costo</ThGlobal>
                      <ThGlobal className="text-left p-3">Concepto de la transacción</ThGlobal>
                      <ThGlobal className="text-left p-3">Debe</ThGlobal>
                      <ThGlobal className="text-left p-3">Haber</ThGlobal>
                      <ThGlobal className="text-left p-3">Acciones</ThGlobal>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr
                        key={index}
                        className={classNames(
                          'border-b border-slate-200',
                          index === selectedIndex && 'bg-slate-100 dark:bg-slate-900'
                        )}
                        onClick={() => setSelectedIndex(index)}
                      >
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          <CodCuentaSelect
                            index={index}
                            isReadOnly={
                              item.codCuenta === ivaShoppingCod ||
                              index === items.length - 1 ||
                              (!editAccount && isReadOnly)
                            }
                            items={items}
                            openCatalogModal={openCatalogModal}
                            setItems={setItems}
                            onClose={onClose}
                          />
                        </td>

                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          <p>{branchName}</p>
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          <Input
                            aria-labelledby="Concepto"
                            classNames={{
                              base: 'font-semibold',
                            }}
                            isReadOnly={isReadOnly}
                            labelPlacement="outside"
                            placeholder="Ingresa el concepto de la partida"
                            value={items[index].descTran}
                            variant="bordered"
                            onChange={(e) => {
                              const itemss = [...items];
                              const currentValue = e.target.value;

                              // Actualiza la descripción del ítem actual
                              itemss[index].descTran = currentValue;

                              // Actualiza el estado con los nuevos ítems
                              setItems(itemss);
                            }}
                          />
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          <Input
                            aria-labelledby="Debe"
                            className="min-w-24"
                            classNames={{
                              base: 'font-semibold',
                            }}
                            isReadOnly={
                              Number(items[index].haber) > 0 ||
                              index === items.length - 1 ||
                              item.codCuenta === ivaShoppingCod ||
                              isReadOnly ||
                              items[index].isExenta
                            }
                            labelPlacement="outside"
                            placeholder="0.00"
                            value={items[index].debe}
                            variant="bordered"
                            onChange={(e) => {
                              handleInputChange(index, 'debe', e.target.value);
                            }}
                          />
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          <Input
                            aria-labelledby="Haber"
                            className="min-w-24"
                            classNames={{
                              base: 'font-semibold',
                            }}
                            isReadOnly={
                              Number(items[index].debe) > 0 ||
                              index === items.length - 1 ||
                              item.codCuenta === ivaShoppingCod ||
                              isReadOnly ||
                              items[index].isExenta
                            }
                            labelPlacement="outside"
                            placeholder="0.00"
                            value={items[index].haber}
                            variant="bordered"
                            onChange={(e) => {
                              handleInputChange(index, 'haber', e.target.value);
                            }}
                          />
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          <ButtonUi
                            isIconOnly
                            isDisabled={
                              item.codCuenta === ivaShoppingCod ||
                              index === items.length - 1 ||
                              isReadOnly
                            }
                            theme={Colors.Error}
                            onPress={() => handleRemove(index)}
                          >
                            <Trash size={20} />
                          </ButtonUi>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100" />
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100" />
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        <p className="text-lg font-semibold">Totales:</p>
                      </td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        <Input
                          readOnly
                          classNames={{ base: 'font-semibold' }}
                          labelPlacement="outside"
                          placeholder="0.00"
                          value={$debe.toFixed(2)}
                          variant="bordered"
                        />
                      </td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        <Input
                          readOnly
                          classNames={{ base: 'font-semibold' }}
                          labelPlacement="outside"
                          placeholder="0.00"
                          value={$haber.toFixed(2)}
                          variant="bordered"
                        />
                      </td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100" />
                    </tr>
                    <tr>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100" />
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100" />
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100" />
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        <p className="text-lg font-semibold">Diferencia:</p>
                      </td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        <Input
                          readOnly
                          classNames={{ base: 'font-semibold' }}
                          labelPlacement="outside"
                          placeholder="0.00"
                          value={$total.toString()}
                          variant="bordered"
                        />
                      </td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100" />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}

export default AccountItem;
