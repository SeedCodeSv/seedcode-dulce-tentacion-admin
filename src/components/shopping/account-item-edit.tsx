import { Accordion, AccordionItem, Input, Select, SelectItem, Textarea } from '@heroui/react';
import classNames from 'classnames';
import { useEffect } from 'react';
import { useTypeOfAccountStore } from '@/store/type-of-aacount.store';
import { Plus, Trash } from 'lucide-react';
import { AccountItemProps } from './types/shopping-manual.types';
import { CodCuentaSelect } from './manual/cod-cuenta-select';
import ThGlobal from '@/themes/ui/th-global';
import { Colors } from '@/types/themes.types';
import ButtonUi from '@/themes/ui/button-ui';

function AccountItemEdit({
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
  exenta,
  setExenta,
}: AccountItemProps) {
  const { list_type_of_account, getListTypeOfAccount } = useTypeOfAccountStore();

  const handleChangeDes = (text: string) => {
    setDescription(text);
    const newItems = items.map((item) => {
      if (item.isExenta) {
        return item;
      } else if (Number(exenta) > 0) {
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

    // Calcula el total excluyendo el último y penúltimo elemento, y la fila EXENTA
    const total = updatedItems
      .slice(0, -2) // Excluye los últimos dos elementos (IVA y total)
      .filter((item) => item.debe === exenta || item.isExenta) // Excluye la fila EXENTA
      .reduce((acc, item) => acc + Number(item.debe) + Number(item.haber), 0);

    const result = Number(total.toFixed(2)); // Redondea a 2 decimales
    const iva13 = Number((result * 0.13).toFixed(2)); // Calcula el IVA del 13%

    // Actualiza el penúltimo elemento (IVA)
    updatedItems[updatedItems.length - 2].debe = iva13.toFixed(2);
    updatedItems[updatedItems.length - 2].haber = '0';

    // Actualiza el último elemento (total + IVA), excluyendo la fila EXENTA
    updatedItems[updatedItems.length - 1].haber = (result + iva13).toFixed(2);
    updatedItems[updatedItems.length - 1].debe = '0';

    // Actualiza el estado
    setItems(updatedItems);
  };

  const handleRemove = (index: number) => {
    // Filtra el ítem a eliminar y excluye el último y penúltimo elemento
    const newItems = items.filter((_, i) => i !== index && i < items.length - 2);

    // Si la fila eliminada es EXENTA, actualizar el estado $exenta a '0'
    if (items[index].isExenta == true || items[index].debe === exenta) {
      setExenta!('0');
    }

    // Calcula el total excluyendo el último y penúltimo elemento
    const total = newItems
      .map((item) => Number(item.debe) + Number(item.haber))
      .reduce((a, b) => a + b, 0);

    const iva13 = Number((total * 0.13).toFixed(2)); // Calcula el IVA del 13%

    const lastItem = items[items.length - 1];
    const prevItem = items[items.length - 2];

    // Agrega el penúltimo y último elemento con los valores de IVA y total + IVA
    newItems.push(
      { ...prevItem, debe: iva13.toFixed(2), haber: '0' }, // Penúltimo elemento (IVA)
      { ...lastItem, debe: '0', haber: (total + iva13).toFixed(2) } // Último elemento (total + IVA)
    );

    // Actualiza el estado con los nuevos ítems
    setItems(newItems);
  };

  return (
    <>
      <div className="w-full mt-4 border p-3 rounded-[12px]">
        <Accordion>
          <AccordionItem
            textValue="Partida contable"
            key="1"
            title={<p className="text-xl font-semibold">Partida contable</p>}
          >
            <div>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  classNames={{
                    base: 'font-semibold',
                  }}
                  labelPlacement="outside"
                  variant="bordered"
                  type="date"
                  label="Fecha de la partida"
                  value={date}
                  readOnly={isReadOnly}
                  onChange={(e) => setDate(e.target.value)}
                ></Input>
                <Select
                  classNames={{
                    base: 'font-semibold',
                  }}
                  labelPlacement="outside"
                  variant="bordered"
                  label="Tipo de partida"
                  placeholder="Selecciona el tipo de partida"
                  isDisabled={isReadOnly}
                  selectedKeys={selectedType > 0 ? [selectedType.toString()] : []}
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
                  isReadOnly={isReadOnly}
                  label="Concepto de la partida"
                  placeholder="Ingresa el concepto de la partida"
                  variant="bordered"
                  classNames={{
                    base: 'font-semibold',
                  }}
                  labelPlacement="outside"
                  value={description}
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
                    {items
                      .sort((a, b) => a.no - b.no)
                      .map((item, index) => (
                        <tr
                          className={classNames(
                            'border-b border-slate-200',
                            index === selectedIndex && 'bg-slate-100 dark:bg-slate-900'
                          )}
                          onClick={() => setSelectedIndex(index)}
                          key={index}
                        >
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            <CodCuentaSelect
                              openCatalogModal={openCatalogModal}
                              onClose={onClose}
                              items={items}
                              setItems={setItems}
                              index={index}
                              isReadOnly={
                                item.codCuenta === ivaShoppingCod ||
                                index === items.length - 1 ||
                                (!editAccount && isReadOnly)
                              }
                            />
                          </td>

                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            <p>{branchName}</p>
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            <Input
                              aria-labelledby="Concepto"
                              placeholder="Ingresa el concepto de la partida"
                              variant="bordered"
                              classNames={{
                                base: 'font-semibold',
                              }}
                              labelPlacement="outside"
                              value={item.descTran} // Usar "item" en lugar de "items[index]"
                              isReadOnly={isReadOnly}
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
                              placeholder="0.00"
                              variant="bordered"
                              classNames={{
                                base: 'font-semibold',
                              }}
                              labelPlacement="outside"
                              isReadOnly={
                                Number(item.haber) > 0 || // Usar "item" en lugar de "items[index]"
                                index === items.length - 1 ||
                                item.codCuenta === ivaShoppingCod ||
                                isReadOnly ||
                                item.isExenta ||
                                item.debe === exenta
                              }
                              value={item.debe} // Usar "item" en lugar de "items[index]"
                              onChange={(e) => {
                                handleInputChange(index, 'debe', e.target.value);
                              }}
                            />
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            <Input
                              aria-labelledby="Haber"
                              className="min-w-24"
                              placeholder="0.00"
                              variant="bordered"
                              classNames={{
                                base: 'font-semibold',
                              }}
                              labelPlacement="outside"
                              isReadOnly={
                                Number(item.debe) > 0 || // Usar "item" en lugar de "items[index]"
                                index === items.length - 1 ||
                                item.codCuenta === ivaShoppingCod ||
                                isReadOnly ||
                                item.isExenta ||
                                item.debe === exenta
                              }
                              value={item.haber} // Usar "item" en lugar de "items[index]"
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
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100"></td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100"></td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        <p className="text-lg font-semibold">Totales:</p>
                      </td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        <Input
                          placeholder="0.00"
                          variant="bordered"
                          classNames={{ base: 'font-semibold' }}
                          labelPlacement="outside"
                          value={$debe.toFixed(2)}
                          readOnly
                        />
                      </td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        <Input
                          placeholder="0.00"
                          variant="bordered"
                          classNames={{ base: 'font-semibold' }}
                          labelPlacement="outside"
                          value={$haber.toFixed(2)}
                          readOnly
                        />
                      </td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100"></td>
                    </tr>
                    <tr>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100"></td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100"></td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100"></td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        <p className="text-lg font-semibold">Diferencia:</p>
                      </td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        <Input
                          placeholder="0.00"
                          variant="bordered"
                          classNames={{ base: 'font-semibold' }}
                          labelPlacement="outside"
                          value={$total.toString()}
                          readOnly
                        />
                      </td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100"></td>
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

export default AccountItemEdit;
