import useGlobalStyles from '@/components/global/global.styles';
import Pagination from '@/components/global/Pagination';
import Layout from '@/layout/Layout';
import { useAccountCatalogsStore } from '@/store/accountCatalogs.store';
import { useBranchesStore } from '@/store/branches.store';
import { useTypeOfAccountStore } from '@/store/type-of-aacount.store';
import { AccountCatalog, AccountCatalogPayload } from '@/types/accountCatalogs.types';
import { formatDate } from '@/utils/dates';
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
  Switch,
  Textarea,
  useDisclosure,
} from '@nextui-org/react';
import classNames from 'classnames';
import { Plus, Search, Trash } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { CodCuentaProps } from './types/types';
import { useAccountingItemsStore } from '@/store/accounting-items.store';
import { useNavigate } from 'react-router';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { verify_item_count } from '@/services/accounting-items.service';
import axios from 'axios';
import { API_URL } from '@/utils/constants';
import { useAuthStore } from '@/store/auth.store';

interface Items {
  no: number;
  codCuenta: string;
  descCuenta: string;
  centroCosto?: string;
  descTran: string;
  debe: string;
  haber: string;
}

const AccountTypes = [
  { key: 'Rubro', value: 'Rubro', label: 'Rubro' },
  { key: 'Mayor', value: 'Mayor', label: 'Mayor' },
  { key: 'SubCuenta', value: 'SubCuenta', label: 'SubCuenta' },
];

const UploadAS = [
  { key: 'Activo', value: 'Activo', label: 'Activo' },
  { key: 'Pasivo', value: 'Pasivo', label: 'Pasivo' },
  { key: 'Patrimonio', value: 'Patrimonio', label: 'Patrimonio' },
  { key: 'Resultado Deudoras', value: 'Resultado Deudoras', label: 'Resultado Deudoras' },
  { key: 'Resultado Acreedoras', value: 'Resultado Acreedoras', label: 'Resultado Acreedoras' },
  { key: 'Cuentas de Cierre', value: 'Cuentas De Cierre', label: 'Cuentas de Cierre' },
  { key: 'Orden Deudoras', value: 'Orden Deudoras', label: 'Orden Deudoras' },
  { key: 'Orden Acreedoras', value: 'Orden Acreedoras', label: 'Orden Acreedoras' },
];

const Item = [
  { key: 'NA', value: 'N/A', label: 'N/A' },
  { key: 'Ingreso', value: 'Ingreso', label: 'Ingreso' },
  { key: 'Costo', value: 'Costo', label: 'Costo' },
  { key: 'Gasto', value: 'Gasto', label: 'Gasto' },
];

function AddAccountingItems() {
  const styles = useGlobalStyles();
  const { getAccountCatalogs } = useAccountCatalogsStore();
  const { branch_list, getBranchesList } = useBranchesStore();
  const { list_type_of_account, getListTypeOfAccount } = useTypeOfAccountStore();

  const [date, setDate] = useState(formatDate());
  const [selectedType, setSelectedType] = useState(0);
  const [description, setDescription] = useState('');

  useEffect(() => {
    getAccountCatalogs('', '');
    getBranchesList();
    getListTypeOfAccount();
  }, []);

  const { user } = useAuthStore();

  const [items, setItems] = useState<Items[]>([
    {
      no: 1,
      codCuenta: '',
      descCuenta: '',
      centroCosto: undefined,
      descTran: '',
      debe: '0',
      haber: '0',
    },
  ]);

  const handleAddItem = () => {
    const newItem = {
      codCuenta: '',
      descCuenta: '',
      centroCosto: undefined,
      descTran: description,
      debe: '0',
      haber: '0',
      no: items.length + 1,
    };
    setItems((prevItems) => {
      const updatedItems = [...prevItems, newItem];
      return updatedItems;
    });
  };

  const handleDeleteItem = (index: number) => {
    const itemss = [...items];
    itemss.splice(index, 1);
    setItems([...itemss]);
    if (selectedIndex === index) {
      setSelectedIndex(null);
    }
  };

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const catalogModal = useDisclosure();
  const addAccountModal = useDisclosure();

  const openCatalogModal = (index: number) => {
    setEditIndex(index);
    catalogModal.onOpen();
  };

  const $debe = useMemo(() => {
    return items.reduce((acc, item) => acc + Number(item.debe), 0);
  }, [items]);

  const $haber = useMemo(() => {
    return items.reduce((acc, item) => acc + Number(item.haber), 0);
  }, [items]);

  const $total = useMemo(() => {
    return Number((Number($debe.toFixed(2)) - Number($haber.toFixed(2))).toFixed(2));
  }, [$debe, $haber]);

  const { addAddItem } = useAccountingItemsStore();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSave = () => {
    if (items.length === 0) {
      toast.warning('Debe agregar al menos una partida');
      return;
    }

    if (!validateItems(items)) {
      return;
    }

    if (!date) {
      toast.warning('Debe seleccionar una fecha');
      return;
    }

    if (selectedType === 0) {
      toast.warning('Debe seleccionar un tipo de partida');
      return;
    }

    if ($total !== 0) {
      toast.warning('La diferencia debe ser 0');
      return;
    }

    setLoading(true);
    const trandId =
      user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0;
    addAddItem({
      date: date,
      typeOfAccountId: selectedType,
      concepOfTheItem: description,
      totalDebe: $debe,
      totalHaber: $haber,
      difference: $total,
      transmitterId: trandId,
      itemDetails: items.map((item, index) => ({
        numberItem: (index + 1).toString(),
        catalog: item.codCuenta,
        branchId: item.centroCosto !== '' ? Number(item.centroCosto) : undefined,
        should: Number(item.debe),
        see: Number(item.haber),
        conceptOfTheTransaction: item.descTran.length > 0 ? item.descTran : 'N/A',
      })),
    })
      .then((res) => {
        if (res) {
          toast.success('La partida contable ha sido creada exitosamente');
          setLoading(false);
          window.location.reload();
        } else {
          toast.error('Error al crear la partida contable');
          setLoading(false);
        }
      })
      .catch(() => {
        toast.error('Error al crear la partida contable');
        setLoading(false);
      });
  };

  const validateItems = (item: Items[]) => {
    const itemsExist = item.some((item) => item.codCuenta === '');
    const notHasDebeOrHaber = item.every((item) => item.debe !== '0' || item.haber !== '0');

    if (itemsExist || !notHasDebeOrHaber) {
      toast.warning('Debe agregar al menos una partida');
      return false;
    }

    return true;
  };

  const formik = useFormik({
    initialValues: {
      code: '',
      name: '',
      majorAccount: '',
      level: '',
      hasSub: false,
      type: '',
      loadAs: '',
      item: '',
    },
    validationSchema: yup.object().shape({
      code: yup.string().required('**Campo requerido**'),
      name: yup.string().required('**Campo requerido**'),
      majorAccount: yup.string().required('**Campo requerido**'),
      level: yup.string().required('**Campo requerido**'),
      hasSub: yup.boolean().required('**Campo requerido**'),
      type: yup.string().required('**Campo requerido**'),
      loadAs: yup.string().required('**Campo requerido**'),
      item: yup.string().required('**Campo requerido**'),
    }),
    onSubmit(values, formikHelpers) {
      if (values.code.slice(0, -2).length < 4) {
        toast.error('No puedes agregar una cuenta con un código menor a 4 caracteres');
        formikHelpers.setSubmitting(false);
        return;
      }

      verify_item_count(values.code.slice(0, -2)).then((res) => {
        if (res.data.countItems > 0) {
          formikHelpers.setSubmitting(false);
          toast.error('Ya existen partidas contables con esta cuenta');
          return;
        } else {
          const payload: AccountCatalogPayload = {
            ...values,
          };

          try {
            axios
              .post(API_URL + '/account-catalogs', payload)
              .then(() => {
                toast.success('Operación realizada con éxito');
                formikHelpers.setSubmitting(false);
                formikHelpers.resetForm();
                getAccountCatalogs('', '');
                addAccountModal.onClose();
              })
              .catch((error) => {
                if (
                  error.response &&
                  error.response.data.message.includes('AccountCatalog with code')
                ) {
                  toast.warning('Ya existe una cuenta con este código');
                } else {
                  toast.error('Error al guardar la cuenta');
                }
                formikHelpers.setSubmitting(false);
              });
          } catch (error) {
            toast.error('Error inesperado al guardar la cuenta');
            formikHelpers.setSubmitting(false);
          }
        }
      });
    },
  });

  return (
    <Layout title="Agregar Partida Contable">
      <>
        <div className="w-full h-full bg-gray-50 dark:bg-gray-800">
          <div className="w-full h-full flex flex-col p-3 pt-8 overflow-y-auto bg-white shadow rounded-xl dark:bg-gray-900">
            <div className="grid grid-cols-1 gap-5 mt-2 md:grid-cols-2">
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
                selectedKeys={[selectedType.toString()]}
                onSelectionChange={(key) => {
                  if (key) {
                    setSelectedType(Number(key.currentKey));
                  }
                }}
              >
                {list_type_of_account.map((type) => (
                  <SelectItem value={type.id} key={type.id}>
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
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div
              className={classNames(
                'flex items-center py-2 gap-5',
                selectedIndex !== null && items[selectedIndex]?.codCuenta !== ''
                  ? 'justify-between'
                  : 'justify-end'
              )}
            >
              {selectedIndex !== null && items[selectedIndex]?.codCuenta !== '' && (
                <div className="bg-red-100 px-10 py-2 border text-red-600 font-semibold text-sm  border-red-500 rounded">
                  {items[selectedIndex]?.codCuenta} - {items[selectedIndex]?.descCuenta}
                </div>
              )}
              <div className="flex justify-end gap-10">
                <Button onPress={() => addAccountModal.onOpen()} style={styles.thirdStyle}>
                  Agregar cuenta
                </Button>
                <Button onPress={handleAddItem} isIconOnly style={styles.secondaryStyle}>
                  <Plus />
                </Button>
              </div>
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
                        <CodCuentaSelect
                          openCatalogModal={openCatalogModal}
                          onClose={catalogModal.onClose}
                          items={items}
                          setItems={setItems}
                          index={index}
                        />
                      </td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        <Select
                          aria-labelledby="Centro de costo"
                          className="min-w-44"
                          variant="bordered"
                          placeholder="Selecciona el centro"
                          selectedKeys={[items[index].centroCosto ? items[index].centroCosto : '']}
                          onSelectionChange={(key) => {
                            if (key) {
                              const branchId = key.currentKey;
                              setItems((prevItems) => {
                                const updatedItems = [...prevItems];
                                updatedItems[index].centroCosto = branchId;
                                return updatedItems;
                              });
                            }
                          }}
                        >
                          {branch_list.map((branch) => (
                            <SelectItem value={branch.id} key={branch.id}>
                              {branch.name}
                            </SelectItem>
                          ))}
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
            <div className="flex justify-end gap-5 mt-3">
              <Button
                isLoading={loading}
                className="px-20"
                style={styles.dangerStyles}
                onPress={() => navigate('/accounting-items')}
              >
                Cancelar
              </Button>
              <Button
                isLoading={loading}
                className="px-20"
                style={styles.secondaryStyle}
                onPress={() => handleSave()}
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
        {editIndex !== null && (
          <Modal
            isOpen={catalogModal.isOpen}
            size="2xl"
            onClose={catalogModal.onClose}
            scrollBehavior="inside"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ItemPaginated
                    onClose={onClose}
                    items={items}
                    setItems={setItems}
                    index={editIndex}
                  />
                </>
              )}
            </ModalContent>
          </Modal>
        )}
        <Modal
          isOpen={addAccountModal.isOpen}
          size="2xl"
          onClose={addAccountModal.onClose}
          scrollBehavior="inside"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    formik.submitForm();
                  }}
                >
                  <ModalHeader className="flex flex-col gap-1">
                    Agregar cuenta al catálogo
                  </ModalHeader>
                  <ModalBody>
                    <div className="w-full">
                      <div className="grid w-full grid-cols-1 gap-5 gap-y-2 mt-2 md:grid-cols-2">
                        <div>
                          <Input
                            classNames={{ label: 'font-semibold' }}
                            label="Código"
                            placeholder="Ingrese el código"
                            variant="bordered"
                            value={formik.values.code}
                            name="code"
                            onChange={formik.handleChange('code')}
                            onBlur={formik.handleBlur('code')}
                            labelPlacement="outside"
                            isInvalid={!!formik.touched.code && !!formik.errors.code}
                            errorMessage={formik.errors.code}
                          />
                        </div>
                        <div>
                          <Input
                            classNames={{ label: 'font-semibold' }}
                            label="Nombre"
                            placeholder="Ingrese el nombre"
                            variant="bordered"
                            value={formik.values.name}
                            name="name"
                            onChange={formik.handleChange('name')}
                            onBlur={formik.handleBlur('name')}
                            labelPlacement="outside"
                            isInvalid={!!formik.touched.name && !!formik.errors.name}
                            errorMessage={formik.errors.name}
                          />
                        </div>

                        <div>
                          <Input
                            label="Cuenta Mayor"
                            labelPlacement="outside"
                            name="majorAccount"
                            value={formik.values.majorAccount}
                            onChange={formik.handleChange('majorAccount')}
                            onBlur={formik.handleBlur('majorAccount')}
                            placeholder="Ingrese la cuenta mayor"
                            classNames={{ label: 'font-semibold' }}
                            variant="bordered"
                            isInvalid={
                              !!formik.touched.majorAccount && !!formik.errors.majorAccount
                            }
                            errorMessage={formik.errors.majorAccount}
                          />
                        </div>
                        <div>
                          <div className="pt-1 pb-2 mb-1">
                            <label className="font-semibold block">Sub Cuenta</label>
                            <Switch
                              color="primary"
                              checked={formik.values.hasSub}
                              onChange={(e) => formik.setFieldValue('hasSub', e.target.checked)}
                              size="lg"
                            />
                          </div>
                        </div>

                        <div>
                          <Select
                            classNames={{ label: 'font-semibold' }}
                            variant="bordered"
                            label="Tipo de cuenta"
                            placeholder="Selecciona el tipo"
                            labelPlacement="outside"
                            defaultSelectedKeys={[`${formik.values.type}`]}
                            onSelectionChange={(key) => {
                              const value = new Set(key).values().next().value;
                              key
                                ? formik.setFieldValue('type', value)
                                : formik.setFieldValue('typeSale', '');
                            }}
                            onBlur={formik.handleBlur('type')}
                            isInvalid={!!formik.touched.type && !!formik.errors.type}
                            errorMessage={formik.errors.type}
                          >
                            {AccountTypes.map((type) => (
                              <SelectItem key={type.key} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </Select>
                        </div>

                        <div>
                          <Select
                            classNames={{ label: 'font-semibold' }}
                            variant="bordered"
                            label="Cargar como"
                            placeholder="Selecciona el tipo"
                            labelPlacement="outside"
                            defaultSelectedKeys={[`${formik.values.loadAs}`]}
                            onSelectionChange={(key) => {
                              const value = new Set(key).values().next().value;
                              key
                                ? formik.setFieldValue('loadAs', value)
                                : formik.setFieldValue('loadAs', '');
                            }}
                            onBlur={formik.handleBlur('loadAs')}
                            isInvalid={!!formik.touched.loadAs && !!formik.errors.loadAs}
                            errorMessage={formik.errors.loadAs}
                          >
                            {UploadAS.map((type) => (
                              <SelectItem key={type.key} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </Select>
                        </div>

                        <div>
                          <Select
                            classNames={{ label: 'font-semibold' }}
                            variant="bordered"
                            label="Elemento"
                            placeholder="Selecciona el Elemento"
                            labelPlacement="outside"
                            defaultSelectedKeys={[`${formik.values.item}`]}
                            onSelectionChange={(key) => {
                              const value = new Set(key).values().next().value;
                              key
                                ? formik.setFieldValue('item', value)
                                : formik.setFieldValue('item', '');
                            }}
                            onBlur={formik.handleBlur('item')}
                            isInvalid={!!formik.touched.item && !!formik.errors.item}
                            errorMessage={formik.errors.item}
                          >
                            {Item.map((type) => (
                              <SelectItem key={type.key} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </Select>
                        </div>
                        <div>
                          <Input
                            classNames={{ label: 'font-semibold' }}
                            label="Nivel de Cuenta"
                            placeholder="Ingrese el nivel de cuenta"
                            variant="bordered"
                            value={formik.values.level}
                            name="level"
                            onChange={formik.handleChange('level')}
                            onBlur={formik.handleBlur('level')}
                            labelPlacement="outside"
                            isInvalid={!!formik.touched.level && !!formik.errors.level}
                            errorMessage={formik.errors.level}
                          />
                        </div>
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter className="w-full">
                    <Button
                      isLoading={formik.isSubmitting}
                      className="px-10"
                      onPress={onClose}
                      style={styles.dangerStyles}
                    >
                      Cancelar
                    </Button>
                    <Button
                      className="px-10"
                      style={styles.thirdStyle}
                      isLoading={formik.isSubmitting}
                      type="submit"
                    >
                      Agregar cuenta
                    </Button>
                  </ModalFooter>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </Layout>
  );
}

export default AddAccountingItems;

export const CodCuentaSelect = (props: CodCuentaProps) => {
  const { account_catalog_pagination, loading } = useAccountCatalogsStore();
  const LIMIT = 20;

  // Inicializa solo con el código
  const initialCode = props.items[props.index].codCuenta || '';
  const initialDesc = props.items[props.index].descCuenta || '';
  const [name, setName] = useState(initialCode ? `${initialCode} - ${initialDesc}` : '');

  const itemsPag = useMemo(() => {
    const sortedItems = account_catalog_pagination.accountCatalogs.sort((a, b) =>
      a.code.localeCompare(b.code)
    );

    if (name.trim() !== '') {
      // Si se está escribiendo algo que no incluye " - ", filtra por código
      return sortedItems
        .filter((item) => (item.code + ' - ' + item.name).startsWith(name))
        .slice(0, LIMIT);
    }

    return sortedItems.slice(0, LIMIT); // Devuelve la lista completa si no hay búsqueda
  }, [account_catalog_pagination, name]);

  const onChange = (key: string) => {
    if (key) {
      const items = [...props.items];
      const value = String(key);

      const itemFind = account_catalog_pagination.accountCatalogs.find(
        (item) => item.code === value
      );
      if (itemFind) {
        if (itemFind.subAccount) {
          toast.error('No se puede agregar una cuenta con sub-cuentas');
          return;
        }

        const item = items[props.index];
        item.codCuenta = itemFind.code;
        item.descCuenta = itemFind.name;
        props.setItems([...items]);

        // Actualiza el input con "code - name"
        setName(`${itemFind.code} - ${itemFind.name}`);
      }
    }
  };

  const handleInputChange = (e: string) => {
    setName(e); // Actualiza el estado solo cuando el usuario escribe
  };

  return (
    <>
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
        onInputChange={handleInputChange} // Usa una función dedicada para cambios en el input
        startContent={
          <Button isIconOnly size="sm" onPress={() => props.openCatalogModal(props.index)}>
            <Search />
          </Button>
        }
        isLoading={loading}
        selectedKey={props.items[props.index].codCuenta} // Selecciona usando el código
        onSelectionChange={(key) => {
          if (key) {
            onChange(String(key));
          }
        }}
      >
        {itemsPag.map((account) => (
          <AutocompleteItem
            key={account.code}
            value={account.code} // El valor seleccionado será el código
            textValue={`${account.code} - ${account.name}`}
          >
            {account.code} - {account.name} {/* Muestra ambos en las opciones */}
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <span>{}</span>
    </>
  );
};

interface PropsItems {
  items: Items[];
  setItems: Dispatch<SetStateAction<Items[]>>;
  index: number;
  onClose: () => void;
}

export const ItemPaginated = (props: PropsItems) => {
  const { account_catalog_pagination } = useAccountCatalogsStore();

  const ITEMS_PER_PAGE = 15;

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    return account_catalog_pagination.accountCatalogs.filter((item) =>
      item.code.toLowerCase().startsWith(search.toLowerCase())
    );
  }, [search, account_catalog_pagination]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  }, [filteredData]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const styles = useGlobalStyles();

  const handleSelectItem = (item: AccountCatalog) => {
    if (item.subAccount) {
      toast.error('No se puede agregar una cuenta con sub-cuentas');
      return;
    }
    const items = [...props.items];
    items[props.index].codCuenta = item.code;
    props.setItems([...items]);
    props.onClose();
  };

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Catalogo de cuentas</ModalHeader>
      <ModalBody>
        <div>
          <Input
            classNames={{ base: 'font-semibold' }}
            labelPlacement="outside"
            variant="bordered"
            label="Buscar por código"
            placeholder="Escribe para buscar..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          <div className="overflow-x-auto flex flex-col h-full custom-scrollbar mt-4">
            <table className="w-full">
              <thead className="sticky top-0 z-20 bg-white">
                <tr>
                  <th
                    style={styles.darkStyle}
                    className="p-3 whitespace-nowrap text-xs font-semibold text-left"
                  >
                    Code
                  </th>
                  <th
                    style={styles.darkStyle}
                    className="p-3 whitespace-nowrap text-xs font-semibold text-left"
                  >
                    Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr
                    key={item.code}
                    className="cursor-pointer"
                    onClick={() => handleSelectItem(item)}
                  >
                    <td className="p-3 text-sm text-slate-500 dark:text-slate-100">{item.code}</td>
                    <td className="p-3 text-sm text-slate-500 dark:text-slate-100">{item.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="w-full">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          nextPage={currentPage + 1}
          previousPage={currentPage - 1}
        />
      </ModalFooter>
    </>
  );
};
