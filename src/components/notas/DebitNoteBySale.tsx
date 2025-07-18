import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, CircleX, EllipsisVertical, LoaderCircle, X } from 'lucide-react';
import {
  Button,
  Chip,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";

import useGlobalStyles from '../global/global.styles';

import { formatCurrency } from '@/utils/dte';
import { useReportNoteSalesStore } from '@/store/reports/report_notes_sale.store';
import { get_sale_pdf_debit_note } from '@/services/sales.service';
import { TableComponent } from '@/themes/ui/table-ui';

function NotesDebitBySale() {
  const { id } = useParams();
  const { notasDebitos, OnGetNotasDebitos } = useReportNoteSalesStore();
  const navigation = useNavigate();
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [pdfPath, setPdfPath] = useState('');
  const styles = useGlobalStyles();

  useEffect(() => {
    OnGetNotasDebitos(Number(id));
  }, []);

  const handleGetPDF = (saleId: number, typeDte: string) => {
    setLoadingPdf(true);
    get_sale_pdf_debit_note(saleId, typeDte).then((res) => {
      setPdfPath(URL.createObjectURL(res.data));
      setLoadingPdf(false);
    });
  };

  return (
    <>
      <>
        <div className="flex flex-col p-10 overflow-x-hidden">
          <div className="grid w-full grid-cols-3 gap-5">
            <button className="flex items-center gap-3 cursor-pointer" onClick={() => navigation(-1)}>
              <ArrowLeft className="dark:text-white" />
              <p className=" whitespace-nowrap dark:text-white">Regresar</p>
            </button>
          </div>
          <TableComponent
            headers={['No.', 'Fecha - Hora', 'Número de control', 'Sello recibido', 'Estado', 'SubTotal', 'Acciones']}
          >
            {notasDebitos.map((sale, index) => (
              <tr key={index} className="border-b border-slate-200">
                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">{sale.id}</td>
                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                  {sale.fecEmi} - {sale.horEmi}
                </td>
                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                  {sale.numeroControl}
                </td>
                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                  {sale.selloRecibido}
                </td>
                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                  <Chip
                    classNames={{
                      content: 'text-white text-sm !font-bold px-3',
                    }}
                    color={(() => {
                      switch (sale.salesStatus.name) {
                        case 'PROCESADO':
                          return 'success';
                        case 'ANULADA':
                          return 'danger';
                        case 'CONTINGENCIA':
                          return 'warning';
                        default:
                          return 'default';
                      }
                    })()}
                  >
                    {sale.salesStatus.name}
                  </Chip>
                </td>
                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                  {formatCurrency(Number(sale.montoTotalOperacion))}
                </td>
                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                  {!pdfPath && (
                    <Popover showArrow>
                      <PopoverTrigger>
                        <Button isIconOnly>
                          <EllipsisVertical size={20} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-1">
                        {sale.salesStatus.name === 'PROCESADO' && (
                          <Listbox aria-label="Actions" className="dark:text-white">
                            <ListboxItem
                              key="show-pdf"
                              classNames={{ base: 'font-semibold' }}
                              color="danger"
                              variant="flat"
                              onPress={handleGetPDF.bind(null, sale.id, sale.tipoDte)}
                            >
                              Ver comprobante
                            </ListboxItem>
                            <ListboxItem
                              key="invalidate-nde"
                              classNames={{ base: 'font-semibold' }}
                              color="danger"
                              variant="flat"
                              onPress={() => navigation("/annulation/06/" + sale.id)}
                            >
                              Invalidar
                            </ListboxItem>
                          </Listbox>
                        )}
                        {sale.salesStatus.name === 'INVALIDADO' && (
                          <>
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
                          </>
                        )}
                      </PopoverContent>
                    </Popover>
                  )}
                </td>
              </tr>
            ))}
          </TableComponent>
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
                      <iframe className="w-screen h-screen z-[2000]" src={pdfPath} title='pdf' />
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
      </>
    </>
  );
}
export default NotesDebitBySale;
