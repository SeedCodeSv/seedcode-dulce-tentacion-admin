import useGlobalStyles from '@/components/global/global.styles';
import Layout from '@/layout/Layout';
import { useAccountCatalogsStore } from '@/store/accountCatalogs.store';
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from '@nextui-org/react';
import classNames from 'classnames';
import { Plus, Search, Trash } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

interface Items {
  no: number;
  codCuenta: string;
  descCuenta: string;
  centroCosto: string;
  descTran: string;
  debe: string;
  haber: string;
}

function AddAccountingItems() {
  const styles = useGlobalStyles();
  const { getAccountCatalogs } = useAccountCatalogsStore();

  useEffect(() => {
    getAccountCatalogs('', '');
  }, []);

  const [items, setItems] = useState([
    {
      no: 1,
      codCuenta: '',
      descCuenta: '',
      centroCosto: '',
      descTran: '',
      debe: '0',
      haber: '0',
    },
  ]);

  const handleAddItem = () => {
    const newItem = {
      codCuenta: '',
      descCuenta: '',
      centroCosto: '',
      descTran: '',
      debe: '0',
      haber: '0',
      no: items.length + 1,
    };
    setItems((prevItems) => {
      const updatedItems = [newItem, ...prevItems];
      return updatedItems;
    });
  };

  const handleDeleteItem = (index: number) => {
    const itemss = [...items];
    itemss.splice(index, 1);
    setItems([...itemss]);
  };

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <Layout title="Agregar Partida Contable">
      <>
        <div className="w-full h-full bg-gray-50 dark:bg-gray-800">
          <div className="w-full h-full flex flex-col p-3 pt-8 overflow-y-auto bg-white shadow rounded-xl dark:bg-gray-900">
            <div className="grid grid-cols-1 gap-5 mt-2 md:grid-cols-3">
              <Input
                classNames={{
                  base: 'font-semibold',
                }}
                labelPlacement="outside"
                variant="bordered"
                type="date"
                label="Fecha de la partida"
              ></Input>
              <Select
                classNames={{
                  base: 'font-semibold',
                }}
                labelPlacement="outside"
                variant="bordered"
                label="Tipo de partida"
                placeholder="Selecciona el tipo de partida"
              >
                <SelectItem value="Ingreso" key={1}>
                  Ingreso
                </SelectItem>
                <SelectItem value="Egreso" key={2}>
                  Egreso
                </SelectItem>
              </Select>
              <Input
                classNames={{
                  base: 'font-semibold',
                }}
                placeholder="Ingresa el numero de la partida"
                labelPlacement="outside"
                variant="bordered"
                label="Cantidad"
              ></Input>
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
              />
            </div>
            <div
              className={classNames(
                'flex items-center py-2 gap-5',
                selectedIndex !== null && items[selectedIndex].codCuenta !== ''
                  ? 'justify-between'
                  : 'justify-end'
              )}
            >
              {selectedIndex !== null && items[selectedIndex].codCuenta !== '' && (
                <div className="bg-red-100 px-10 py-2 border text-red-600 font-semibold text-sm  border-red-500 rounded">
                  {items[selectedIndex].codCuenta} - {items[selectedIndex].descCuenta}
                </div>
              )}
              <Button onPress={handleAddItem} isIconOnly style={styles.secondaryStyle}>
                <Plus />
              </Button>
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
                    <th
                      style={styles.darkStyle}
                      className="p-3 whitespace-nowrap text-xs font-semibold text-left"
                    >
                      Acciones
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
                        <CodCuentaSelect items={items} setItems={setItems} index={index} />
                      </td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        <Select
                          aria-labelledby="Centro de costo"
                          className="min-w-44"
                          variant="bordered"
                          placeholder="Selecciona el centro"
                        >
                          <SelectItem value="1" key={1}>
                            1
                          </SelectItem>
                          <SelectItem value="2" key={2}>
                            2
                          </SelectItem>
                        </Select>
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
                            const itemss = [...items];
                            itemss[index].debe = e.target.value.replace(/[^0-9.]/g, '');
                            setItems([...items]);
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
                            const itemss = [...items];
                            itemss[index].haber = e.target.value.replace(/[^0-9.]/g, '');
                            setItems([...items]);
                          }}
                        />
                      </td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        <Button
                          onPress={() => handleDeleteItem(index)}
                          isIconOnly
                          style={styles.dangerStyles}
                        >
                          <Trash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Modal isOpen={false} size="lg" onClose={() => {}}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Cuentas contables</ModalHeader>
                <ModalBody>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus
                    non risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed
                    porttitor quam.
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus
                    non risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed
                    porttitor quam.
                  </p>
                  <p>
                    Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit
                    dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit
                    duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Action
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </Layout>
  );
}

export default AddAccountingItems;

interface Props {
  items: Items[];
  setItems: Dispatch<SetStateAction<Items[]>>;
  index: number;
}

export const CodCuentaSelect = (props: Props) => {
  const { account_catalog_pagination, loading } = useAccountCatalogsStore();

  const LIMIT = 20;

  const [name, setName] = useState('');

  const itemsPag = useMemo(() => {
    const sortedItems = account_catalog_pagination.accountCatalogs.sort((a, b) =>
      a.code.localeCompare(b.code)
    );

    if (name.trim() !== '') {
      return sortedItems
        .filter((item) => item.code.startsWith(name)) // No necesitas toLowerCase si son números.
        .slice(0, LIMIT);
    }

    return sortedItems.slice(0, LIMIT);
  }, [account_catalog_pagination, name]);

  const onChange = (key: string) => {
    if (key) {
      const items = [...props.items];

      const value = String(key);

      const itemFind = account_catalog_pagination.accountCatalogs.find(
        (item) => item.code === value
      );
      if (itemFind) {

        if(itemFind.subAccount){
          toast.error('No se puede agregar una cuenta con subcuentas');
          return;
        }

        const item = items[props.index];
        item.codCuenta = itemFind.code;
        item.descCuenta = itemFind.name;
        props.setItems([...items]);
      }
    }
  };

  return (
    <Autocomplete
      className="min-w-52"
      placeholder="Buscar cuenta"
      variant="bordered"
      inputProps={{
        classNames: {
          inputWrapper: 'pl-1',
        },
      }}
      aria-describedby="Cuenta"
      aria-labelledby="Cuenta"
      onInputChange={(e) => setName(e)}
      startContent={
        <Button isIconOnly size="sm">
          <Search />
        </Button>
      }
      isLoading={loading}
      selectedKey={props.items[props.index].codCuenta}
      onSelectionChange={(key) => {
        if (key) {
          onChange(String(key));
        }
      }}
    >
      {itemsPag.map((account) => (
        <AutocompleteItem key={account.code} value={account.code} textValue={account.code}>
          {account.code}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
};
