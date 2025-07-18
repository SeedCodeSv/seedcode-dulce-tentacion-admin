import { useEffect, useState } from 'react';
import axios from 'axios';
import { EllipsisVertical, X } from 'lucide-react';
import { HiXCircle } from 'react-icons/hi2';
import { toast } from 'sonner';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import {
  Button,
  Chip,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tab,
  Tabs,
  useDisclosure
} from '@heroui/react';

import { salesReportStore } from '../store/reports/sales_report.store';
import { useAuthStore } from '../store/auth.store';
import { useBranchProductReportStore } from '../store/reports/branch_product.store';
import { formatCurrency } from '../utils/dte';

import '../components/home/style.css';
import Charts from '@/components/home/charts';
import { Sale } from '@/types/sales.types';
import { s3Client } from '@/plugins/s3';
import { SPACES_BUCKET } from '@/utils/constants';
import { get_pdf_fe_cfe } from '@/services/pdf.service';
import useIsMobileOrTablet from '@/hooks/useIsMobileOrTablet';
import FullPageLayout from '@/components/global/FullOverflowLayout';
import ResendEmail from '@/components/reporters/ResendEmail';
import LoadingTable from '@/components/global/LoadingTable';
import { TableComponent } from '@/themes/ui/table-ui';
import DivGlobal from '@/themes/ui/div-global';


function Home() {
  const {
    getSalesByBranchAndMonth,
    getSalesByYearAndMonth,
    getSalesByDay,
    getSalesTableDay,
    sales_table_day,
    getSalesTableDayDetails,
    sales_table_day_details,
    loading_sales_by_table_details,
    loading_sales_by_table_date,
  } = salesReportStore();

  const { getMostProductMostSelled } = useBranchProductReportStore();
  const showPdf = useDisclosure();
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [unseen, setUnseen] = useState(false)


  const [openPopover, setOpenPopover] = useState<string | null>(null)

  const togglePopover = (path: string) => {
    setOpenPopover((prev) => (prev === path ? null : path))
  }

  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      const transmitterId =
        user.pointOfSale?.branch?.transmitterId ?? user.pointOfSale?.branch?.transmitterId ?? 0;

      getSalesByBranchAndMonth(transmitterId);
      getMostProductMostSelled(transmitterId);
      getSalesByYearAndMonth(transmitterId);
      getSalesByDay(transmitterId);
      getSalesTableDay(transmitterId);
      getSalesTableDayDetails(transmitterId)
    }
  }, [user]);

  const showPDF = async (sale: Sale): Promise<void> => {
    setLoadingPdf(true);
    showPdf.onOpen();
    get_pdf_fe_cfe(sale.codigoGeneracion)
      .then((res) => {
        setPdfUrl(URL.createObjectURL(res.data));
        setLoadingPdf(false);
      })
      .catch(() => {
        toast.error('No se pudo obtener el PDF');
        setLoadingPdf(false);
      });
  };

  const downloadJSON = async (sale: Sale) => {
    try {
      const url = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: SPACES_BUCKET,
          Key: sale.pathJson,
        })
      );
      const response = await axios.get(url, { responseType: 'json' });

      const jsonBlob = new Blob([JSON.stringify(response.data, null, 2)], {
        type: 'application/json',
      });

      const link = document.createElement('a');

      link.href = URL.createObjectURL(jsonBlob);
      link.download = `${sale.numeroControl}_document.json`;
      link.click();
    } catch (error) {
      toast.error('No se pudo descargar el JSON');
    }
  };

  const downloadPDF = async (sale: Sale): Promise<void> => {
    setLoadingPdf(true);

    try {
      const res = await get_pdf_fe_cfe(sale.codigoGeneracion);
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const link = document.createElement('a');

      link.href = pdfUrl;
      link.download = `${sale.codigoGeneracion}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      toast.error('No se pudo descargar el PDF');
    } finally {
      setLoadingPdf(false);
    }
  };

  const isMovil = useIsMobileOrTablet();

  const handleAction = (key: string, sale: Sale) => {
    switch (key) {
      case 'show-pdf':
        if (isMovil) {
          downloadPDF(sale);
        } else {
          showPDF(sale);
        }
        break;
      case 'download-json':
        downloadJSON(sale);
        break;
      case 'resend-email':
        setUnseen(true)

        return;
      default:
        toast.error(`Acción desconocida:${key}`);
    }
    setOpenPopover(null)
  };

  const renderSaleActions = (sale: Sale) => {
    if (sale.salesStatus.name === 'INVALIDADO' || sale.salesStatus.name === 'CONTINGENCIA') {
      return (
        <Listbox aria-label="Actions" className="dark:text-white">
          <ListboxItem key="" classNames={{ base: 'font-semibold' }} color="danger" variant="flat">
            <HiXCircle size={20} />
          </ListboxItem>
        </Listbox>
      );
    }

    if (sale.salesStatus.name === 'PROCESADO') {
      const isCreditoFiscal = sale.tipoDte === '03';

      return (
        <Listbox
          aria-label="Actions"
          className="dark:text-white "
          onAction={(key) => handleAction(String(key), sale)}
        >
          <ListboxItem
            key="show-pdf"
            classNames={{ base: 'font-semibold' }}
            color="danger"
            variant="flat"
          >
            Ver comprobante, {isCreditoFiscal ? 'crédito fiscal' : 'factura comercial'}
          </ListboxItem>

          <ListboxItem key="resend-email">
            <ResendEmail
              customerId={sale.customerId}
              id={user!.transmitterId}
              path={sale.pathJson}
              tipoDte={sale.tipoDte}
              onClose={() => {
                setUnseen(false)
              }}
            />
          </ListboxItem>

          <ListboxItem
            key="download-json"
            classNames={{ base: 'font-semibold' }}
            color="danger"
            variant="flat"
          >
            Descargar JSON
          </ListboxItem>
        </Listbox>
      );
    }

    return null;
  };
  const [selectedTab, setSelectedTab] = useState('Details');


  return (
    <DivGlobal>
      <div className="grid w-full gap-5 mt-3 grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        <Charts />
      </div>
      <div >
        <p className="my-3 text-lg font-semibold dark:text-white">Ventas del dia</p>

        <>
          <div className="flex gap-2 mb-4">
            <button
              className={`px-4 py-2 rounded ${selectedTab === 'Summary'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-800'
                }`}
              onClick={() => setSelectedTab('Summary')}
            >
              Resumen por sucursal
            </button>
            <button
              className={`px-4 py-2 rounded ${selectedTab === 'Details'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-800'
                }`}
              onClick={() => setSelectedTab('Details')}
            >
              Ventas detalladas
            </button>
          </div>

          {selectedTab === 'Summary' && (
            <div className="w-full max-h-[400px] md:max-h-full overflow-y-auto">
              <div className="col-span-3 dark:border-gray-500 dark:bg-gray-900">
                {loading_sales_by_table_date ? (
                  <LoadingTable />
                ) : (
                  <TableComponent
                    className="pt-0"
                    headers={['Nº', 'Nombre', 'Total']}
                  >
                    {sales_table_day.map((sl, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-200 dark:border-slate-500"
                      >
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {index + 1}
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {sl.branch}
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {formatCurrency(+sl.totalSales)}
                        </td>
                      </tr>
                    ))}
                  </TableComponent>
                )}
              </div>
            </div>
          )}

          {selectedTab === 'Details' && (
            <>
              {loading_sales_by_table_details ? (
                <LoadingTable />
              ) : (
                <TableComponent
                  headers={['Nº de control', 'Sucursal', 'Estado', 'Total', 'Acciones']}
                >
                  {sales_table_day_details.map((sale, index) => (
                    <tr
                      key={index}
                      className="border-b dark:border-slate-600 border-slate-200"
                    >
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        {sale.numeroControl}
                      </td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        {sale.employee.branch.name}
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
                        ${sale.montoTotalOperacion}
                      </td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        <Popover
                          classNames={{
                            content: unseen
                              ? 'opacity-0 invisible pointer-events-none'
                              : 'bg-white dark:bg-gray-800',
                          }}
                          isOpen={openPopover === sale.pathJson}
                          showArrow={!unseen}
                          onOpenChange={() => togglePopover(sale.pathJson)}
                        >
                          <PopoverTrigger>
                            <Button
                              isIconOnly
                              onPress={() => togglePopover(sale.pathJson)}
                            >
                              <EllipsisVertical size={20} />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-1">
                            {renderSaleActions(sale)}
                          </PopoverContent>
                        </Popover>
                      </td>
                    </tr>
                  ))}
                </TableComponent>
              )}
            </>
          )}
        </>

      </div>
      <FullPageLayout show={showPdf.isOpen}>
        <div className="w-full h-full bg-white rounded-2xl relative">
          <Button
            isIconOnly
            className="absolute bottom-6 left-6"
            color="danger"
            onPress={() => {
              showPdf.onClose();
              setPdfUrl(null);
            }}
          >
            <X />
          </Button>
          {loadingPdf ? (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <div className="loader" />
              <p className="mt-5 text-xl">Cargando...</p>
            </div>
          ) : pdfUrl ? (
            // eslint-disable-next-line jsx-a11y/iframe-has-title
            <iframe className="w-full h-full" src={pdfUrl} />
          ) : (
            <p className="w-full h-full flex justify-center items-center">
              No se pudo cargar el PDF.
            </p>
          )}
        </div>
      </FullPageLayout>
    </DivGlobal>
  );
}

export default Home;
