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
} from '@heroui/react';
import classNames from 'classnames';
import { Plus, Search, Trash } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';

import { CodCuentaProps, Items } from './types/types';

import Pagination from '@/components/global/Pagination';
import Layout from '@/layout/Layout';
import { useAccountCatalogsStore } from '@/store/accountCatalogs.store';
import { useBranchesStore } from '@/store/branches.store';
import { useTypeOfAccountStore } from '@/store/type-of-aacount.store';
import { AccountCatalog, AccountCatalogPayload } from '@/types/accountCatalogs.types';
import { formatDate } from '@/utils/dates';
import { useAccountingItemsStore } from '@/store/accounting-items.store';
import { verify_item_count } from '@/services/accounting-items.service';
import { API_URL } from '@/utils/constants';
import { useAuthStore } from '@/store/auth.store';
import ThGlobal from '@/themes/ui/th-global';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

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
  const { getAccountCatalogs } = useAccountCatalogsStore();
  const { branch_list, getBranchesList } = useBranchesStore();
  const { list_type_of_account, getListTypeOfAccount } = useTypeOfAccountStore();

  const [date, setDate] = useState(formatDate());
  const [selectedType, setSelectedType] = useState(0);
  const [description, setDescription] = useState('');

  const { user } = useAuthStore();

  useEffect(() => {
    const transmitterId = user?.pointOfSale?.branch.transmitter.id;

    getAccountCatalogs(transmitterId ?? 0, '', '');
    getBranchesList();
    getListTypeOfAccount();
  }, []);

  const [items, setItems] = useState<Items[]>([
    {
      itemId: 0,
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
      itemId: 0,
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
    const trandId = user?.pointOfSale?.branch.transmitterId ?? 0;

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
          const transmitterId = user?.pointOfSale?.branch.transmitter.id;

          const payload: AccountCatalogPayload = {
            ...values,
            transmitterId: Number(transmitterId ?? 0),
          };

          try {
            axios
              .post(API_URL + '/account-catalogs', payload)
              .then(() => {
                toast.success('Operación realizada con éxito');
                formikHelpers.setSubmitting(false);
                formikHelpers.resetForm();
                getAccountCatalogs(transmitterId ?? 0, '', '');
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
    <>
      <div className="w-full h-full bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full flex flex-col p-3 pt-8 overflow-y-auto bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="grid grid-cols-1 gap-5 mt-2 md:grid-cols-2">
            <Input
              classNames={{
                base: 'font-semibold',
              }}
              label="Fecha de la partida"
              labelPlacement="outside"
              type="date"
              value={date}
              variant="bordered"
              onChange={(e) => setDate(e.target.value)}
            />
            <Select
              classNames={{
                base: 'font-semibold',
              }}
              label="Tipo de partida"
              labelPlacement="outside"
              placeholder="Selecciona el tipo de partida"
              selectedKeys={[selectedType.toString()]}
              variant="bordered"
              onSelectionChange={(key) => {
                if (key) {
                  setSelectedType(Number(key.currentKey));
                }
              }}
            >
              {list_type_of_account.map((type) => (
                <SelectItem key={type.id}>{type.name}</SelectItem>
              ))}
            </Select>
          </div>
          <div className="mt-3">
            <Textarea
              classNames={{
                base: 'font-semibold',
              }}
              label="Concepto de la partida"
              labelPlacement="outside"
              placeholder="Ingresa el concepto de la partida"
              value={description}
              variant="bordered"
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
              <ButtonUi theme={Colors.Info} onPress={() => addAccountModal.onOpen()}>
                Agregar cuenta
              </ButtonUi>
              <ButtonUi isIconOnly theme={Colors.Success} onPress={handleAddItem}>
                <Plus />
              </ButtonUi>
            </div>
          </div>
          <div className="overflow-x-auto flex flex-col h-full custom-scrollbar mt-4">
            <table className="w-full">
              <thead className="sticky top-0 z-20 bg-white">
                <tr>
                  <ThGlobal className="text-left p-3">Cod. cuenta</ThGlobal>
                  <ThGlobal className="text-left p-3">Centro costo</ThGlobal>
                  <ThGlobal className="text-left p-3">Concepto</ThGlobal>
                  <ThGlobal className="text-left p-3">Debe</ThGlobal>
                  <ThGlobal className="text-left p-3">Haber</ThGlobal>
                  <ThGlobal className="text-left p-3">Acciones</ThGlobal>
                </tr>
              </thead>
              <tbody>
                {items.map((_, index) => (
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
                        items={items}
                        openCatalogModal={openCatalogModal}
                        setItems={setItems}
                        onClose={catalogModal.onClose}
                      />
                    </td>
                    <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                      <Select
                        aria-labelledby="Centro de costo"
                        className="min-w-44"
                        placeholder="Selecciona el centro"
                        selectedKeys={[items[index].centroCosto ? items[index].centroCosto : '']}
                        variant="bordered"
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
                          <SelectItem key={branch.id}>{branch.name}</SelectItem>
                        ))}
                      </Select>
                    </td>
                    <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                      <Input
                        aria-labelledby="Concepto"
                        classNames={{
                          base: 'font-semibold',
                        }}
                        labelPlacement="outside"
                        placeholder="Ingresa el concepto de la partida"
                        value={items[index].descTran}
                        variant="bordered"
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
                        classNames={{
                          base: 'font-semibold',
                        }}
                        isReadOnly={Number(items[index].haber) > 0}
                        labelPlacement="outside"
                        placeholder="0.00"
                        value={items[index].debe}
                        variant="bordered"
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
                        classNames={{
                          base: 'font-semibold',
                        }}
                        isReadOnly={Number(items[index].debe) > 0}
                        labelPlacement="outside"
                        placeholder="0.00"
                        value={items[index].haber}
                        variant="bordered"
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
                      <ButtonUi
                        isIconOnly
                        theme={Colors.Error}
                        onPress={() => handleDeleteItem(index)}
                      >
                        <Trash />
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
          <div className="flex justify-end gap-5 mt-3">
            <ButtonUi
              className="px-20"
              isLoading={loading}
              theme={Colors.Default}
              onPress={() => navigate('/accounting-items')}
            >
              Cancelar
            </ButtonUi>
            <ButtonUi
              className="px-20"
              isLoading={loading}
              theme={Colors.Primary}
              onPress={() => handleSave()}
            >
              Guardar
            </ButtonUi>
          </div>
        </div>
      </div>
      {editIndex !== null && (
        <Modal
          isOpen={catalogModal.isOpen}
          scrollBehavior="inside"
          size="2xl"
          onClose={catalogModal.onClose}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ItemPaginated
                  index={editIndex}
                  items={items}
                  setItems={setItems}
                  onClose={onClose}
                />
              </>
            )}
          </ModalContent>
        </Modal>
      )}
      <Modal
        isOpen={addAccountModal.isOpen}
        scrollBehavior="inside"
        size="2xl"
        onClose={addAccountModal.onClose}
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
                          errorMessage={formik.errors.code}
                          isInvalid={!!formik.touched.code && !!formik.errors.code}
                          label="Código"
                          labelPlacement="outside"
                          name="code"
                          placeholder="Ingrese el código"
                          value={formik.values.code}
                          variant="bordered"
                          onBlur={formik.handleBlur('code')}
                          onChange={formik.handleChange('code')}
                        />
                      </div>
                      <div>
                        <Input
                          classNames={{ label: 'font-semibold' }}
                          errorMessage={formik.errors.name}
                          isInvalid={!!formik.touched.name && !!formik.errors.name}
                          label="Nombre"
                          labelPlacement="outside"
                          name="name"
                          placeholder="Ingrese el nombre"
                          value={formik.values.name}
                          variant="bordered"
                          onBlur={formik.handleBlur('name')}
                          onChange={formik.handleChange('name')}
                        />
                      </div>

                      <div>
                        <Input
                          classNames={{ label: 'font-semibold' }}
                          errorMessage={formik.errors.majorAccount}
                          isInvalid={!!formik.touched.majorAccount && !!formik.errors.majorAccount}
                          label="Cuenta Mayor"
                          labelPlacement="outside"
                          name="majorAccount"
                          placeholder="Ingrese la cuenta mayor"
                          value={formik.values.majorAccount}
                          variant="bordered"
                          onBlur={formik.handleBlur('majorAccount')}
                          onChange={formik.handleChange('majorAccount')}
                        />
                      </div>
                      <div>
                        <div className="pt-1 pb-2 mb-1">
                          <span className="font-semibold block">Sub Cuenta</span>
                          <Switch
                            checked={formik.values.hasSub}
                            color="primary"
                            size="lg"
                            onChange={(e) => formik.setFieldValue('hasSub', e.target.checked)}
                          />
                        </div>
                      </div>

                      <div>
                        <Select
                          classNames={{ label: 'font-semibold' }}
                          defaultSelectedKeys={[`${formik.values.type}`]}
                          errorMessage={formik.errors.type}
                          isInvalid={!!formik.touched.type && !!formik.errors.type}
                          label="Tipo de cuenta"
                          labelPlacement="outside"
                          placeholder="Selecciona el tipo"
                          variant="bordered"
                          onBlur={formik.handleBlur('type')}
                          onSelectionChange={(key) => {
                            const value = new Set(key).values().next().value;

                            key
                              ? formik.setFieldValue('type', value)
                              : formik.setFieldValue('typeSale', '');
                          }}
                        >
                          {AccountTypes.map((type) => (
                            <SelectItem key={type.key}>{type.label}</SelectItem>
                          ))}
                        </Select>
                      </div>

                      <div>
                        <Select
                          classNames={{ label: 'font-semibold' }}
                          defaultSelectedKeys={[`${formik.values.loadAs}`]}
                          errorMessage={formik.errors.loadAs}
                          isInvalid={!!formik.touched.loadAs && !!formik.errors.loadAs}
                          label="Cargar como"
                          labelPlacement="outside"
                          placeholder="Selecciona el tipo"
                          variant="bordered"
                          onBlur={formik.handleBlur('loadAs')}
                          onSelectionChange={(key) => {
                            const value = new Set(key).values().next().value;

                            key
                              ? formik.setFieldValue('loadAs', value)
                              : formik.setFieldValue('loadAs', '');
                          }}
                        >
                          {UploadAS.map((type) => (
                            <SelectItem key={type.key}>{type.label}</SelectItem>
                          ))}
                        </Select>
                      </div>

                      <div>
                        <Select
                          classNames={{ label: 'font-semibold' }}
                          defaultSelectedKeys={[`${formik.values.item}`]}
                          errorMessage={formik.errors.item}
                          isInvalid={!!formik.touched.item && !!formik.errors.item}
                          label="Elemento"
                          labelPlacement="outside"
                          placeholder="Selecciona el Elemento"
                          variant="bordered"
                          onBlur={formik.handleBlur('item')}
                          onSelectionChange={(key) => {
                            const value = new Set(key).values().next().value;

                            key
                              ? formik.setFieldValue('item', value)
                              : formik.setFieldValue('item', '');
                          }}
                        >
                          {Item.map((type) => (
                            <SelectItem key={type.key}>{type.label}</SelectItem>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <Input
                          classNames={{ label: 'font-semibold' }}
                          errorMessage={formik.errors.level}
                          isInvalid={!!formik.touched.level && !!formik.errors.level}
                          label="Nivel de Cuenta"
                          labelPlacement="outside"
                          name="level"
                          placeholder="Ingrese el nivel de cuenta"
                          value={formik.values.level}
                          variant="bordered"
                          onBlur={formik.handleBlur('level')}
                          onChange={formik.handleChange('level')}
                        />
                      </div>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter className="w-full">
                  <ButtonUi
                    className="px-10"
                    isLoading={formik.isSubmitting}
                    theme={Colors.Default}
                    onPress={onClose}
                  >
                    Cancelar
                  </ButtonUi>
                  <ButtonUi
                    className="px-10"
                    isLoading={formik.isSubmitting}
                    theme={Colors.Primary}
                    type="submit"
                  >
                    Agregar cuenta
                  </ButtonUi>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
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
        aria-describedby="Cuenta"
        aria-labelledby="Cuenta"
        className="min-w-52"
        inputProps={{
          classNames: {
            inputWrapper: 'pl-1',
          },
        }}
        isLoading={loading}
        placeholder="Buscar cuenta"
        selectedKey={props.items[props.index].codCuenta} // Selecciona usando el código
        startContent={
          <Button isIconOnly size="sm" onPress={() => props.openCatalogModal(props.index)}>
            <Search />
          </Button>
        }
        variant="bordered"
        onInputChange={handleInputChange} // Usa una función dedicada para cambios en el input
        onSelectionChange={(key) => {
          if (key) {
            onChange(String(key));
          }
        }}
      >
        {itemsPag.map((account) => (
          <AutocompleteItem key={account.code} textValue={`${account.code} - ${account.name}`}>
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
            label="Buscar por código"
            labelPlacement="outside"
            placeholder="Escribe para buscar..."
            value={search}
            variant="bordered"
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          <div className="overflow-x-auto flex flex-col h-full custom-scrollbar mt-4">
            <table className="w-full">
              <thead className="sticky top-0 z-20 bg-white">
                <tr>
                  <ThGlobal className="text-left p-3">Código</ThGlobal>
                  <ThGlobal className="text-left p-3">Nombre</ThGlobal>
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
          nextPage={currentPage + 1}
          previousPage={currentPage - 1}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </ModalFooter>
    </>
  );
};
