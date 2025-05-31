import {
  Button,
  Chip,
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
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import Pagination from '../global/Pagination';

import Filters from "./filterSales";

import { formatCurrency } from '@/utils/dte';
import { formatDate } from '@/utils/dates';
import { global_styles } from '@/styles/global.styles';
import { useSalesStore } from '@/store/sales.store';
import { get_sale_pdf } from '@/services/sales.service';
import { limit_options } from '@/utils/constants';
import DivGlobal from "@/themes/ui/div-global";
import { TableComponent } from "@/themes/ui/table-ui";

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
    <DivGlobal>
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
      <TableComponent
        headers={['Nº', 'Fecha - Hora', 'Número de control', 'SubTotal', 'IVA', 'Estado', 'Acciones']}>
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
      </TableComponent>
      {
        sales_dates_pagination.totalPag > 1 && (
          <div className="mt-5 w-full">
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
        )
      }
      {
        loadingPdf && (
          <div className="absolute z-[100] w-screen h-screen inset-0 bg-gray-50 dark:bg-gray-700">
            <div className="flex flex-col items-center justify-center w-full h-full">
              <LoaderCircle className="animate-spin" size={100} />
              <p className="mt-4 text-lg font-semibold">Cargando...</p>
            </div>
          </div>
        )
      }
      {
        pdfPath && (
          <div className="absolute z-[100] w-screen h-screen inset-0 bg-gray-50 dark:bg-gray-700">
            <Button
              isIconOnly
              className="fixed bg-red-600 bottom-10 left-10"
              style={styles.dangerStyles}
              onPress={() => {
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
        )
      }
    </DivGlobal >
  );
}
export default ListSales;

