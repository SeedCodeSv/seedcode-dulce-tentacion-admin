import Layout from '@/layout/Layout';
import { useBranchesStore } from '@/store/branches.store';
import { useFiscalDataAndParameterStore } from '@/store/fiscal-data-and-paramters.store';
import { useSalesStore } from '@/store/sales.store';
import { formatDate } from '@/utils/dates';
import {
  Input,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
  Selection,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { ItemListProps, Items } from './types/types';
import { CodCuentaSelect } from '@/components/shopping/manual/cod-cuenta-select';
import { useAccountCatalogsStore } from '@/store/accountCatalogs.store';
import { useTypeOfAccountStore } from '@/store/type-of-aacount.store';
import debounce from 'debounce';
import { useAuthStore } from '@/store/auth.store';
import { toast } from 'sonner';
import { useAccountingItemsStore } from '@/store/accounting-items.store';
import { useNavigate } from 'react-router';
import { Period } from '@/types/items-period.types';
import { create_period, find_period, update_period } from '@/services/items-period.service';
import { DateTime } from 'luxon';
import ThGlobal from '@/themes/ui/th-global';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

function AddItemsBySales() {
  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());
  const { getFiscalDataAndParameter, fiscalDataAndParameter } = useFiscalDataAndParameterStore();
  const { list_type_of_account, getListTypeOfAccount } = useTypeOfAccountStore();

  const { getAccountCatalogs } = useAccountCatalogsStore();
  const [description, setDescription] = useState('REGISTRO DE VENTAS DEL DIA');
  const [date, setDate] = useState(formatDate());
  const [selectedType, setSelectedType] = useState(0);

  const { user } = useAuthStore();

  const [branches, setBranches] = useState<Selection>(new Set([]));

  const { branch_list, getBranchesList } = useBranchesStore();

  useEffect(() => {
    const transId = user?.correlative
      ? user?.correlative.branch.transmitter.id
      : user?.pointOfSale?.branch.transmitter.id;
    getBranchesList();
    getFiscalDataAndParameter(transId ?? 0);
    getAccountCatalogs(transId ?? 0, '', '');
    getListTypeOfAccount();
  }, []);

  const { saleByItem, getSaleByItem, loadingSalesByItem } = useSalesStore();

  const handleSearch = () => {
    const transId = user?.correlative
      ? user?.correlative.branch.transmitter.id
      : user?.pointOfSale?.branch.transmitter.id;
    const listBranches = Array.from(branches) as number[];
    getSaleByItem(
      transId ?? 0,
      startDate,
      endDate,
      listBranches.length > 0 ? listBranches : undefined
    );

    if (listBranches.length > 0) {
      const description =
        `REGISTRO DE VENTAS DEL DIA - ` +
        listBranches.map((branch) => getBranchName(+branch)).join(', ');

      setDescription(description);
      setItems((prevItems) => {
        return prevItems.map((item) => ({
          ...item,
          descTran: description,
        }));
      });
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const $itemsFilter = useMemo(() => {
    return saleByItem.filter(
      (item) =>
        item.salesCfe > 0 || item.salesTicket > 0 || item.salesFe > 0 || item.salesTicketCfe > 0
    );
  }, [saleByItem]);

  const [items, setItems] = useState<Items[]>([]);

  const [period, setPeriod] = useState<Period>();
  const periodModal = useDisclosure();

  useEffect(() => {
    const items: Items[] = [];

    for (const item of $itemsFilter) {
      const feTotal = Number((item.salesFe + item.salesTicket).toFixed(2));
      const totalSinIva = Number((feTotal / 1.13).toFixed(2));
      const iva = Number((feTotal - totalSinIva).toFixed(2));

      const cfeSinIva = Number(((item.salesCfe + item.salesTicketCfe) / 1.13).toFixed(2));
      const cfeIva = Number((item.salesCfe + item.salesTicketCfe - cfeSinIva).toFixed(2));

      const description = `REGISTRO DE VENTAS DEL DIA - ${item.branch.name}`;

      items.push({
        no: items.length + 1,
        codCuenta: fiscalDataAndParameter?.generalBox ?? '',
        descCuenta: '',
        centroCosto: item.branch.id.toString(),
        descTran: description,
        debe: (feTotal + item.salesCfe + item.salesTicketCfe).toFixed(2),
        haber: '0',
        itemId: 0,
      });

      items.push({
        no: items.length + 1,
        codCuenta: fiscalDataAndParameter?.ivaFinalConsumer ?? '',
        descCuenta: '',
        centroCosto: item.branch.id.toString(),
        descTran: description,
        debe: '0',
        haber: iva.toString(),
        itemId: 0,
      });

      items.push({
        no: items.length + 1,
        codCuenta: '5101010204',
        descCuenta: '',
        centroCosto: item.branch.id.toString(),
        descTran: description,
        debe: '0',
        haber: totalSinIva.toString(),
        itemId: 0,
      });

      if (cfeSinIva > 0) {
        items.push({
          no: items.length + 1,
          codCuenta: fiscalDataAndParameter?.ivaTributte ?? '',
          descCuenta: '',
          centroCosto: item.branch.id.toString(),
          descTran: description,
          debe: '0',
          haber: cfeIva.toString(),
          itemId: 0,
        });
        items.push({
          no: items.length + 1,
          codCuenta: '5101010104',
          descCuenta: '',
          centroCosto: item.branch.id.toString(),
          descTran: description,
          debe: '0',
          haber: cfeSinIva.toString(),
          itemId: 0,
        });
      }
    }
    setItems(items);
  }, [fiscalDataAndParameter, $itemsFilter]);

  const $debe = useMemo(() => {
    return items.reduce((acc, item) => acc + Number(item.debe), 0);
  }, [items]);

  const $haber = useMemo(() => {
    return items.reduce((acc, item) => acc + Number(item.haber), 0);
  }, [items]);

  const $total = useMemo(() => {
    return Number((Number($debe.toFixed(2)) - Number($haber.toFixed(2))).toFixed(2));
  }, [$debe, $haber]);

  const modalCatalog = useDisclosure();

  const getBranchName = (id: number) => {
    const branch = branch_list.find((branch) => branch.id === id);
    return branch?.name || '';
  };

  const handleDescriptionChange = useCallback(
    debounce((value) => {
      setDescription(value);
      setItems((prevItems) => {
        return prevItems.map((item) => ({
          ...item,
          descTran: value,
        }));
      });
    }, 200),
    []
  );

  const [loading, setLoading] = useState(false);

  const { addAddItem, updateAndDeleteItem } = useAccountingItemsStore();
  const navigate = useNavigate();

  const handleSave = async () => {
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

    const listBranches = Array.from(branches) as number[];

    const transId = user?.correlative
      ? user?.correlative.branch.transmitter.id
      : user?.pointOfSale?.branch.transmitter.id;

    const existsPeriod = await find_period(transId ?? 0, startDate, endDate, listBranches);

    if (existsPeriod && existsPeriod.data.period) {
      toast.warning('Ya existe un periodo para estas fechas', {
        description: `Periodo existente: ${existsPeriod.data.period.startDate} - ${existsPeriod.data.period.endDate}`,
      });
      setPeriod(existsPeriod.data.period);
      periodModal.onOpenChange();
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
      .then(async (res) => {
        if (res) {
          await create_period(startDate, endDate, Array.from(branches) as number[], res.id);

          toast.success('La partida contable ha sido creada exitosamente');
          setLoading(false);
          navigate('/accounting-items');
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

  const formatBranchName = (branches: number[]) => {
    if (branches.length === 0) return branch_list.map((b) => b.name).join(', ');
    const branchesName = branches.map((branch) => {
      const branchName = branch_list.find((b) => b.id === branch)?.name;
      return branchName;
    });
    return branchesName.join(', ');
  };

  const formattedStartDate = (startDate: string) => {
    const format = DateTime.fromISO(startDate, { zone: 'America/El_Salvador' });
    const formattedStartDate = format.toLocaleString(DateTime.DATE_FULL);
    return formattedStartDate;
  };

  const [loadingUpdate, setloadingUpdateActions] = useState(false);

  const handleUpdateAndDelete = () => {
    if (period) {
      setloadingUpdateActions(true);
      const trandId =
        user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0;
      updateAndDeleteItem(period.item.id, {
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
        .then(async () => {
          const listBranches = Array.from(branches) as number[];
          setloadingUpdateActions(false);
          await update_period(period.id, startDate, endDate, listBranches, period.item.id);
          toast.success('Partida actualizada');
          navigate('/accounting-items');
        })
        .catch(() => {
          setloadingUpdateActions(false);
          toast.error('Error al actualizar partida');
        });
    }
  };

  return (
    <Layout title="Generar partida de ventas">
      <div className="w-full h-full flex flex-col bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full flex flex-col p-3 pt-8 overflow-y-auto bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="grid grid-cols-2 gap-x-5 gap-y-2 mt-2 md:grid-cols-3">
            <Input
              classNames={{ label: 'font-semibold' }}
              label="Fecha inicial"
              type="date"
              variant="bordered"
              labelPlacement="outside"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              classNames={{ label: 'font-semibold' }}
              label="Fecha final"
              type="date"
              variant="bordered"
              labelPlacement="outside"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <div className="flex gap-5 items-end">
              <Select
                variant="bordered"
                labelPlacement="outside"
                label="Sucursal"
                classNames={{ label: 'font-semibold' }}
                placeholder="Seleccione una sucursal"
                className="col-span-2 md:col-span-1"
                multiple
                isLoading={loadingSalesByItem}
                isRequired={loadingSalesByItem}
                selectionMode="multiple"
                selectedKeys={branches}
                onSelectionChange={setBranches}
              >
                {branch_list.map((branch) => (
                  <SelectItem key={branch.id}>{branch.name}</SelectItem>
                ))}
              </Select>
              <ButtonUi onPress={handleSearch} theme={Colors.Primary}>
                Buscar
              </ButtonUi>
            </div>
          </div>
          <div className="w-full grid grid-cols-2 gap-5 mt-8">
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
                <SelectItem key={type.id} textValue={type.name}>
                  {type.name}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="mt-2">
            <Textarea
              label="Concepto de la partida"
              placeholder="Ingresa el concepto de la partida"
              variant="bordered"
              classNames={{
                base: 'font-semibold',
              }}
              labelPlacement="outside"
              value={description}
              onChange={({ target }) => handleDescriptionChange(target.value)}
            />
          </div>
          <div className="mt-4 h-full overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-20 bg-white">
                <tr>
                  <ThGlobal className="text-left p-3">Cod. cuenta</ThGlobal>
                  <ThGlobal className="text-left p-3">Centro costo</ThGlobal>
                  <ThGlobal className="text-left p-3">Concepto</ThGlobal>
                  <ThGlobal className="text-left p-3">Debe</ThGlobal>
                  <ThGlobal className="text-left p-3">Haber</ThGlobal>
                </tr>
              </thead>
              <tbody>
                {loadingSalesByItem && (
                  <tr>
                    <td colSpan={6} className="p-3 text-sm text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center w-full h-64">
                        <div className="loader"></div>
                        <p className="mt-3 text-xl font-semibold">Cargando...</p>
                      </div>
                    </td>
                  </tr>
                )}
                {!loadingSalesByItem && (
                  <>
                    <ItemsList
                      items={items}
                      setItems={setItems}
                      openModal={modalCatalog.onOpen}
                      isOpen={false}
                      getBranchName={getBranchName}
                    />
                  </>
                )}
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
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-5 mt-3">
            <ButtonUi
              theme={Colors.Default}
              isLoading={loading}
              onPress={() => navigate('/accounting-items')}
            >
              Cancelar
            </ButtonUi>
            <ButtonUi theme={Colors.Primary} isLoading={loading} onPress={() => handleSave()}>
              Guardar
            </ButtonUi>
          </div>
        </div>
        <Modal isOpen={periodModal.isOpen} onOpenChange={periodModal.onOpenChange} size="xl">
          <ModalContent>
            <>
              <ModalHeader>Se encontró una partida contable en este periodo</ModalHeader>
              <ModalBody>
                <p>
                  <span className="font-semibold">Periodo registrado:</span> Del{' '}
                  {period ? formattedStartDate(period.startDate) : '-'} al{' '}
                  {period ? formattedStartDate(period.endDate) : '-'}
                </p>
                <p>
                  <span className="font-semibold">Sucursales:</span>{' '}
                  {formatBranchName(period?.branches || [])}
                </p>
                <p>
                  <span className="font-semibold">Correlativo:</span> {period?.item?.correlative}
                </p>
                <div className="grid grid-cols-2 gap5">
                  <div>
                    <p className="font-semibold text-lg">Debe</p>
                    <p>{period?.item?.totalDebe}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Haber</p>
                    <p>{period?.item?.totalHaber}</p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <ButtonUi
                  isLoading={loadingUpdate}
                  theme={Colors.Default}
                  onPress={() => navigate('/accounting-items')}
                >
                  Cancelar
                </ButtonUi>
                <ButtonUi
                  isLoading={loadingUpdate}
                  theme={Colors.Primary}
                  onPress={() => handleUpdateAndDelete()}
                >
                  Modificar partida
                </ButtonUi>
              </ModalFooter>
            </>
          </ModalContent>
        </Modal>
      </div>
    </Layout>
  );
}

export default AddItemsBySales;

const ItemsList = memo(({ items, setItems, openModal, getBranchName }: ItemListProps) => {
  return (
    <>
      {items.map((item, index) => (
        <tr>
          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
            <CodCuentaSelect
              openCatalogModal={openModal}
              onClose={() => {}}
              items={items}
              setItems={setItems}
              index={index}
              isReadOnly={false}
            />
          </td>
          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
            <Input
              variant="bordered"
              classNames={{
                base: 'font-semibold',
              }}
              labelPlacement="outside"
              readOnly
              value={getBranchName(Number(item.centroCosto ?? 0))}
            />
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
                itemss[index].debe = e.target.value;
                setItems([...itemss]);
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
                itemss[index].haber = e.target.value;
                setItems([...itemss]);
              }}
            />
          </td>
        </tr>
      ))}
    </>
  );
});
