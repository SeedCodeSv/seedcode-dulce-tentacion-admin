import useGlobalStyles from '@/components/global/global.styles';
import {
  Accordion,
  AccordionItem,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
} from '@nextui-org/react';
import classNames from 'classnames';
import { CodCuentaSelect } from './cod-cuenta-select';
import { useEffect } from 'react';
import { useTypeOfAccountStore } from '@/store/type-of-aacount.store';
import { AccountItemProps } from '../types/shopping-manual.types';
import { Plus, Trash } from 'lucide-react';

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
  canAddItem,
  isReadOnly,
  editAccount,
  setExenta
}: AccountItemProps) {
  const styles = useGlobalStyles();
  const { list_type_of_account, getListTypeOfAccount } = useTypeOfAccountStore();

  const handleChangeDes = (text: string) => {
    setDescription(text);
    const newItems = items.map((item) => {
      // Si el item tiene "comienza con "Exenta:", no se actualiza
      if (item.descTran && item.descTran.startsWith('Exenta:')) {
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

    // Calcula el total excluyendo el último y penúltimo elemento
    const total = updatedItems
      .slice(0, -2) // Excluye los últimos dos elementos
      .map((item) => Number(item.debe) + Number(item.haber))
      .reduce((a, b) => a + b, 0);

    const result = Number(total.toFixed(2)); // Redondea a 2 decimales
    const iva13 = Number((result * 0.13).toFixed(2)); // Calcula el IVA del 13%

    // Actualiza el penúltimo elemento (IVA)
    updatedItems[updatedItems.length - 2].debe = iva13.toFixed(2);
    updatedItems[updatedItems.length - 2].haber = '0';

    // Actualiza el último elemento (total + IVA)
    updatedItems[updatedItems.length - 1].haber = (result + iva13).toFixed(2);
    updatedItems[updatedItems.length - 1].debe = '0';

    // Actualiza el estado
    setItems(updatedItems);
  };
  const handleRemove = (index: number) => {
    // Verificar si la fila eliminada es EXENTA
    const isExenta = items[index]?.descTran?.startsWith("Exenta:");

    // Filtra el ítem a eliminar y excluye el último y penúltimo elemento
    const newItems = items.filter((_, i) => i !== index && i < items.length - 2);

    // Si la fila eliminada es EXENTA, actualizar el estado $exenta a '0'
    if (isExenta) {
      setExenta('0');
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
                    <SelectItem value={type.id.toString()} key={type.id} textValue={type.name}>
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
                {canAddItem && (
                  <Button isIconOnly style={styles.thirdStyle} onPress={addItems}>
                    <Plus size={20} />
                  </Button>
                )}
              </div>
              <div className="overflow-x-auto flex flex-col h-full custom-scrollbar">
                <table className="w-full">
                  <thead className="sticky top-0 z-20 bg-white">
                    <tr>
                      <th
                        style={styles.darkStyle}
                        className="p-3 whitespace-nowrap text-xs font-semibold text-left"
                      >
                        Cod. Cuenta
                      </th>
                      <th
                        style={styles.darkStyle}
                        className="p-3 whitespace-nowrap text-xs font-semibold text-left"
                      >
                        Centro Costo
                      </th>
                      <th
                        style={styles.darkStyle}
                        className="p-3 whitespace-nowrap text-xs font-semibold text-left"
                      >
                        Concepto de la transacción
                      </th>
                      <th
                        style={styles.darkStyle}
                        className="p-3 whitespace-nowrap text-xs font-semibold text-left"
                      >
                        Debe
                      </th>
                      <th
                        style={styles.darkStyle}
                        className="p-3 whitespace-nowrap text-xs font-semibold text-left"
                      >
                        Haber
                      </th>
                      <th
                        style={styles.darkStyle}
                        className="p-3 whitespace-nowrap text-xs font-semibold text-left"
                      >
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
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
                            value={items[index].descTran}
                            isReadOnly={isReadOnly}
                            onChange={(e) => {
                              const itemss = [...items];
                              const currentValue = e.target.value;
                              if (itemss[index].descTran.startsWith('Exenta:')) {
                                const editablePart = currentValue.replace('Exenta: ', '');
                                itemss[index].descTran = `Exenta: ${editablePart}`;
                              } else {
                                itemss[index].descTran = currentValue;
                              }
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
                              Number(items[index].haber) > 0 ||
                              index === items.length - 1 ||
                              item.codCuenta === ivaShoppingCod ||
                              isReadOnly ||
                              (items[index].descTran ? items[index].descTran.startsWith('Exenta:') : false)
                            }
                            value={items[index].debe}
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
                            value={items[index].haber}
                            isReadOnly={
                              Number(items[index].debe) > 0 ||
                              index === items.length - 1 ||
                              item.codCuenta === ivaShoppingCod ||
                              isReadOnly
                            }
                            onChange={(e) => {
                              handleInputChange(index, 'haber', e.target.value);
                            }}
                          />
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          <Button
                            isIconOnly
                            isDisabled={
                              item.codCuenta === ivaShoppingCod ||
                              index === items.length - 1 ||
                              isReadOnly
                            }
                            style={styles.dangerStyles}
                            onPress={() => handleRemove(index)}
                          >
                            <Trash size={20} />
                          </Button>
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

export default AccountItem;
