import useGlobalStyles from '@/components/global/global.styles';
import { Accordion, AccordionItem, Input, Select, SelectItem, Textarea } from '@nextui-org/react';
import classNames from 'classnames';
import { CodCuentaSelect } from './cod-cuenta-select';
import { useEffect } from 'react';
import { useTypeOfAccountStore } from '@/store/type-of-aacount.store';
import { AccountItemProps } from '../types/shopping-manual.types';

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
}: AccountItemProps) {
  const styles = useGlobalStyles();
  const { list_type_of_account, getListTypeOfAccount } = useTypeOfAccountStore();

  const handleChangeDes = (text: string) => {
    setDescription(text);

    const newitems = items.map((item) => ({
      ...item,
      descTran: text,
    }));

    setItems(newitems);
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
              <div className="overflow-x-auto flex flex-col h-full custom-scrollbar mt-4">
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
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((_, index) => (
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
                            onChange={(e) => {
                              const itemss = [...items];
                              itemss[index].descTran = e.target.value;
                              setItems([...items]);
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
                            isReadOnly={Number(items[index].haber) > 0}
                            value={items[index].debe}
                            onChange={(e) => {
                              const inputValue = e.target.value.replace(/[^0-9.]/g, '');
                              const updatedItems = [...items];
                              const currentItem = updatedItems[index];

                              currentItem.debe = inputValue;
                              if (Number(inputValue) > 0) {
                                currentItem.haber = '';
                              }
                              setItems(updatedItems);
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
                            isReadOnly={Number(items[index].debe) > 0}
                            onChange={(e) => {
                              const inputValue = e.target.value.replace(/[^0-9.]/g, '');
                              const updatedItems = [...items];
                              const currentItem = updatedItems[index];

                              currentItem.haber = inputValue;
                              if (Number(inputValue) > 0) {
                                currentItem.debe = '';
                              }
                              setItems(updatedItems);
                            }}
                          />
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
