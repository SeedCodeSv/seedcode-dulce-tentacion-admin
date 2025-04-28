import {
  Button,
  Chip,
  Input,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { CircleX, EllipsisVertical, LoaderCircle, X } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import Pagination from '../global/Pagination';

import { formatCurrency } from '@/utils/dte';
import { formatDate } from '@/utils/dates';
import { global_styles } from '@/styles/global.styles';
import { useSalesStore } from '@/store/sales.store';
import { get_sale_pdf } from '@/services/sales.service';
import { useBranchesStore } from '@/store/branches.store';
import { usePointOfSales } from '@/store/point-of-sales.store';
import { PointOfSale } from '@/types/point-of-sales.types';
import { limit_options } from '@/utils/constants';

function ListSales() {
  const styles = global_styles();
  const [limit, setLimit] = useState(5);
  const [dateInitial, setDateInitial] = useState(formatDate());
  const [dateEnd, setDateEnd] = useState(formatDate());
  const [branch, setBranch] = useState(0);
  const [state, setState] = useState('PROCESADO');
  const [pointOfSale, setPointOfSale] = useState('');
  const [typeVoucher, setTypeVoucher] = useState('');
  const [notes, setNotes] = useState<{ debits: number; credits: number }>({
    debits: 0,
    credits: 0,
  });

  const { sales_dates, getSalesByDatesAndStatus, sales_dates_pagination, getNotesOfSale } =
    useSalesStore();

  // const modalVerify = useDisclosure()
  const navigation = useNavigate();

  useEffect(() => {
    getSalesByDatesAndStatus(
      1,
      limit,
      branch,
      dateInitial,
      dateEnd,
      state,
      typeVoucher,
      pointOfSale
    );
  }, [dateInitial, dateEnd, state, limit, branch, typeVoucher, pointOfSale]);

  const [loadingPdf, setLoadingPdf] = useState(false);
  const [pdfPath, setPdfPath] = useState('');
  const showFullLayout = useDisclosure();

  const handleShowPdf = (saleId: number, typeDte: string) => {
    setLoadingPdf(true);
    showFullLayout.onOpen();
    get_sale_pdf(saleId, typeDte).then((res) => {
      setPdfPath(URL.createObjectURL(res.data));
      setLoadingPdf(false);
    });
  };

  const verifyNotes = (id: number) => {
    getNotesOfSale(id).then((res) => {
      const { debits, credits } = res;

      setNotes({ debits, credits });

      return;
    });
    setNotes({ debits: 0, credits: 0 });
  };

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-gray-800">
      <div className="w-full h-full flex flex-col p-3 mt-3 overflow-y-auto bg-white shadow rounded-xl dark:bg-gray-900">
        <Filters
          branch={branch}
          dateInitial={dateInitial}
          endDate={dateEnd}
          pointOfSale={pointOfSale}
          setBranch={setBranch}
          setDateInitial={setDateInitial}
          setEndDate={setDateEnd}
          setPointOfSale={setPointOfSale}
          setState={setState}
          setTypeVoucher={setTypeVoucher}
          state={state}
          typeVoucher={typeVoucher}
        />
        <div className="flex items-end justify-end mt-3">
          <div>
            <Select
              className="w-44"
              classNames={{
                label: 'font-semibold',
              }}
              defaultSelectedKeys={['5']}
              label="Cantidad a mostrar"
              labelPlacement="outside"
              placeholder="Selecciona la cantidad a mostrar"
              value={limit}
              variant="bordered"
              onChange={(e) => {
                setLimit(Number(e.target.value !== '' ? e.target.value : '5'));
              }}
            >
              {limit_options.map((limit) => (
                <SelectItem key={limit}>
                  {limit}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
        <div className="overflow-x-auto flex flex-col h-full custom-scrollbar mt-4">
          <table className="w-full">
            <thead className="sticky top-0 z-20 bg-white">
              <tr>
                <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                  No.
                </th>
                <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                  Fecha - Hora
                </th>
                <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                  Número de control
                </th>
                <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                  SubTotal
                </th>
                <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                  IVA
                </th>
                <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                  Estado
                </th>
                <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="max-h-[600px] w-full overflow-y-auto">
              {sales_dates?.map((sale, index) => (
                <tr key={index} className="border-b border-slate-200">
                  <td className="p-3 text-sm text-slate-500 dark:text-slate-100">{sale.id}</td>
                  <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                    {sale.fecEmi + ' - ' + sale.horEmi}
                  </td>
                  <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                    {sale.numeroControl}
                  </td>
                  <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                    {formatCurrency(Number(sale.montoTotalOperacion))}
                  </td>
                  <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                    {formatCurrency(Number(sale.totalIva))}
                  </td>
                  <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                    <Chip
                      classNames={{
                        content: 'text-white text-sm !font-bold px-3',
                      }}
                      color={
                        sale.salesStatus.name === 'CONTINGENCIA'
                          ? 'warning'
                          : sale.salesStatus.name === 'PROCESADO'
                            ? 'success'
                            : 'danger'
                      }
                    >
                      {sale.salesStatus.name}
                    </Chip>
                  </td>
                  <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                    {!pdfPath && (
                      <Popover showArrow>
                        <PopoverTrigger>
                          <Button isIconOnly onClick={() => verifyNotes(sale.id)}>
                            <EllipsisVertical size={20} />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-1">
                          {sale.salesStatus.name === 'CONTINGENCIA' ? (
                            <>
                              <Listbox
                                aria-label="Actions"
                                className="dark:text-white"
                              >
                                <ListboxItem
                                  key="show-pdf"
                                  classNames={{ base: 'font-semibold' }}
                                  color="danger"
                                  variant="flat"
                                  onPress={handleShowPdf.bind(null, sale.id, sale.tipoDte)}
                                >
                                  Ver comprobante
                                </ListboxItem>
                              </Listbox>
                            </>
                          ) : (
                            <>
                              {sale.salesStatus.name === 'PROCESADO' ? (
                                <>
                                  {sale.tipoDte === '03' ? (
                                    <>
                                      <Listbox
                                        aria-label="Actions"
                                        className="dark:text-white"
                                        onAction={(key) => {
                                          switch (key) {
                                            case 'debit-note':
                                              navigation('/debit-note/' + sale.id);
                                              break;
                                            case 'show-debit-note':
                                              navigation('/get-debit-note/' + sale.id);
                                              break;
                                            case 'credit-note':
                                              navigation('/credit-note/' + sale.id);
                                              break;
                                            case 'show-credit-note':
                                              navigation('/get-credit-note/' + sale.id);
                                              break;
                                            default:
                                              break;
                                          }
                                        }}
                                      >
                                        {notes.debits > 0 ? (
                                          <ListboxItem
                                            key="show-debit-note"
                                            classNames={{ base: 'font-semibold' }}
                                            color="primary"
                                            variant="flat"
                                          >
                                            Ver notas de débito
                                          </ListboxItem>
                                        ) : (
                                          <ListboxItem
                                            key="debit-note"
                                            classNames={{ base: 'font-semibold' }}
                                            color="danger"
                                            variant="flat"
                                          >
                                            Nota de débito
                                          </ListboxItem>
                                        )}

                                        {notes.credits > 0 ? (
                                          <ListboxItem
                                            key="show-credit-note"
                                            classNames={{ base: 'font-semibold' }}
                                            color="primary"
                                            variant="flat"
                                          >
                                            Ver notas de crédito
                                          </ListboxItem>
                                        ) : (
                                          <ListboxItem
                                            key="credit-note"
                                            classNames={{ base: 'font-semibold' }}
                                            color="danger"
                                            variant="flat"
                                          >
                                            Nota de crédito
                                          </ListboxItem>
                                        )}
                                      </Listbox>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                  <Listbox
                                    aria-label="Actions"
                                    className="dark:text-white"
                                  >
                                    <ListboxItem
                                      key="show-pdf"
                                      classNames={{ base: 'font-semibold' }}
                                      color="danger"
                                      variant="flat"
                                      onClick={handleShowPdf.bind(null, sale.id, sale.tipoDte)}
                                    >
                                      Ver comprobante
                                    </ListboxItem>
                                  </Listbox>
                                </>
                              ) : (
                                <></>
                              )}
                            </>
                          )}
                          {sale.salesStatus.name === 'INVALIDADO' && (
                            <Listbox aria-label="Actions" className="dark:text-white">
                              <ListboxItem
                                key=""
                                classNames={{ base: 'font-semibold' }}
                                color="danger"
                                variant="flat"
                              >
                                <CircleX size={20} />
                              </ListboxItem>
                            </Listbox>
                          )}
                        </PopoverContent>
                      </Popover>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sales_dates_pagination.totalPag > 1 && (
          <div className="mt-5 w-full dark:bg-gray-900">
            <Pagination
              currentPage={sales_dates_pagination.currentPag}
              nextPage={sales_dates_pagination.prevPag}
              previousPage={sales_dates_pagination.nextPag}
              totalPages={sales_dates_pagination.totalPag}
              onPageChange={(page) => {
                getSalesByDatesAndStatus(
                  page,
                  limit,
                  branch,
                  dateInitial,
                  dateEnd,
                  state,
                  typeVoucher,
                  pointOfSale
                );
              }}
            />
          </div>
        )}
      </div>
      {loadingPdf && (
        <div className="absolute z-[100] w-screen h-screen inset-0 bg-gray-50 dark:bg-gray-700">
          <div className="flex flex-col items-center justify-center w-full h-full">
            <LoaderCircle className="animate-spin" size={100} />
            <p className="mt-4 text-lg font-semibold">Cargando...</p>
          </div>
        </div>
      )}
      {pdfPath && (
        <div className="absolute z-[100] w-screen h-screen inset-0 bg-gray-50 dark:bg-gray-700">
          <Button
            isIconOnly
            className="fixed bg-red-600 bottom-10 left-10"
            style={styles.dangerStyles}
            onClick={() => {
              setPdfPath('');
            }}
          >
            <X />
          </Button>
          {loadingPdf ? (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <LoaderCircle className="animate-spin" size={100} />
              <p className="mt-4 text-lg font-semibold">Cargando...</p>
            </div>
          ) : (
            <>
              {pdfPath !== '' ? (
                <div className="w-full h-full">
                  <iframe className="w-screen h-screen z-[2000]" src={pdfPath} title="pdf" />
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <p>No hay información acerca de este PDF</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
export default ListSales;

interface FiltersProps {
  dateInitial: string;
  setDateInitial: Dispatch<SetStateAction<string>>;
  endDate: string;
  setEndDate: Dispatch<SetStateAction<string>>;
  branch: number;
  setBranch: Dispatch<SetStateAction<number>>;
  state: string;
  setState: Dispatch<SetStateAction<string>>;
  typeVoucher: string;
  setTypeVoucher: Dispatch<SetStateAction<string>>;
  pointOfSale: string;
  setPointOfSale: Dispatch<SetStateAction<string>>;
}

const Filters = (props: FiltersProps) => {
  const { branch_list, getBranchesList } = useBranchesStore();
  const { point_of_sales_list, getPointOfSalesList } = usePointOfSales();

  useEffect(() => {
    getBranchesList();
  }, []);

  useEffect(() => {
    getPointOfSalesList(props.branch);
  }, [props.branch]);

  const estadosV = [
    { label: 'PROCESADO', value: 'PROCESADO' },
    { label: 'CONTINGENCIA', value: 'CONTINGENCIA' },
    { label: 'INVALIDADO', value: 'INVALIDADO' },
  ];

  const filteredPoints = useMemo(() => {
    if (point_of_sales_list.pointOfSales) {
      const pointOfSalesArray = Object.values(
        point_of_sales_list.pointOfSales
      ).flat() as Array<PointOfSale>;

      return pointOfSalesArray.filter((point) => point.typeVoucher === 'FE');
    }

    return [];
  }, [point_of_sales_list]);

  return (
    <div className="grid grid-cols-3 gap-5">
      <Input
        className="z-0"
        classNames={{
          input: 'dark:text-white dark:border-gray-600',
          label: 'text-sm font-semibold dark:text-white',
        }}
        defaultValue={formatDate()}
        label="Fecha inicial"
        labelPlacement="outside"
        placeholder="Buscar por nombre..."
        type="date"
        value={props.dateInitial}
        variant="bordered"
        onChange={(e) => props.setDateInitial(e.target.value)}
      />
      <Input
        classNames={{
          input: 'dark:text-white dark:border-gray-600',
          label: 'text-sm font-semibold dark:text-white',
        }}
        label="Fecha final"
        labelPlacement="outside"
        placeholder="Buscar por nombre..."
        type="date"
        value={props.endDate}
        variant="bordered"
        onChange={(e) => props.setEndDate(e.target.value)}
      />
      <Select
        className="z-0"
        classNames={{
          label: 'text-sm font-semibold dark:text-white',
        }}
        label="Sucursal"
        labelPlacement="outside"
        placeholder="Selecciona la sucursal"
        variant="bordered"
        onSelectionChange={(key) => {
          if (key) {
            const branchId = Number(new Set(key).values().next().value);

            props.setBranch(branchId);
          } else {
            props.setBranch(0);
          }
        }}
      >
        {branch_list.map((item) => (
          <SelectItem key={item.id}>
            {item.name}
          </SelectItem>
        ))}
      </Select>
      <Select
        classNames={{
          label: 'text-sm font-semibold dark:text-white',
        }}
        label="Punto de venta"
        labelPlacement="outside"
        placeholder="Selecciona un punto de venta"
        variant="bordered"
        onSelectionChange={(key) => {
          if (key) {
            const pointOfSale = String(new Set(key).values().next().value);

            props.setPointOfSale(pointOfSale);
          } else {
            props.setPointOfSale('');
          }
        }}
      >
        {filteredPoints.map((item) => (
          <SelectItem key={item.code}>
            {item.code}
          </SelectItem>
        ))}
      </Select>
      <Select
        classNames={{
          label: 'text-sm font-semibold dark:text-white',
        }}
        label="Tipo de comprobante"
        labelPlacement="outside"
        placeholder="Selecciona el tipo de comprobante"
        variant="bordered"
        onChange={(e) => props.setTypeVoucher(e.target.value)}
      >
        <SelectItem key="01">
          FE - Factura Comercial
        </SelectItem>
        <SelectItem key="03">
          CCFE - Crédito Fiscal Electrónico
        </SelectItem>
      </Select>
      <Select
        className="dark:text-white"
        classNames={{
          label: 'text-sm font-semibold dark:text-white',
        }}
        label="Mostrar por estado"
        labelPlacement="outside"
        placeholder="Selecciona un estado"
        value={props.state}
        variant="bordered"
        onChange={(e) => props.setState(e.target.value)}
      >
        {estadosV.map((e) => (
          <SelectItem key={e.value} className="dark:text-white">
            {e.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};
