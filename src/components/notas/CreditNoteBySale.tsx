import {
  Button,
  Chip,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@heroui/react';
import { ArrowLeft, EllipsisVertical, LoaderCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import useGlobalStyles from '../global/global.styles';

import { formatCurrency } from '@/utils/dte';
import { useReportNoteSalesStore } from '@/store/report_notes_sale.store';
import { get_sale_pdf_credit_note } from '@/services/sales.service';
import Layout from '@/layout/Layout';

function NotesCreditBySale() {
  const { id } = useParams();
  const { notasCreditos, OnGetNotasCreditos } = useReportNoteSalesStore();
  const navigation = useNavigate();
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [pdfPath, setPdfPath] = useState('');
  const styles = useGlobalStyles();

  useEffect(() => {
    OnGetNotasCreditos(Number(id));
  }, []);

  const handleGetPDF = (saleId: number, typeDte: string) => {
    setLoadingPdf(true);
    get_sale_pdf_credit_note(saleId, typeDte).then((res) => {
      setPdfPath(URL.createObjectURL(res.data));
      setLoadingPdf(false);
    });
  };

  return (
    <Layout title="NOTAS DE CRÉDITO">
      <>
        <div className="flex flex-col p-10 overflow-x-hidden bg-gray-50 dark:bg-gray-800">
          <div className="grid w-full grid-cols-3 gap-5">
            <button
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigation(-1)}
            >
              <ArrowLeft />
              <p className=" whitespace-nowrap">Volver a ventas</p>
            </button>
          </div>
          <div className="overflow-x-auto custom-scrollbar mt-10">
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
                    Sello recibido
                  </th>
                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    Estado
                  </th>
                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    SubTotal
                  </th>
                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="max-h-[600px] w-full overflow-y-auto">
                {notasCreditos.map((sale, index) => (
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
                            <Listbox
                              aria-label="Actions"
                              className="dark:text-white"
                            >
                              <ListboxItem
                                key="show-pdf"
                                classNames={{ base: 'font-semibold' }}
                                color="danger"
                                variant="flat"
                                onClick={handleGetPDF.bind(null, sale.id, sale.tipoDte)}
                              >
                                Ver comprobante
                              </ListboxItem>
                              <ListboxItem
                                key="invalidate"
                                classNames={{ base: 'font-semibold' }}
                                color="danger"
                                variant="flat"
                                onClick={() => navigation('/annulation/05/' + sale.id)}
                              >
                                Invalidar
                              </ListboxItem>
                            </Listbox>
                          </PopoverContent>
                        </Popover>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                      <iframe className="w-screen h-screen z-[2000]" src={pdfPath} title="PDF" />
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
    </Layout>
  );
}
export default NotesCreditBySale;
