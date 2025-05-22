import {
  Accordion,
  AccordionItem,
  Button,
  Input,
  Select,
  SelectItem,
  Spinner,
  useDisclosure,
} from '@heroui/react';
import classNames from 'classnames';
import jsPDF from 'jspdf';
import { Eye, Filter, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import FullPageLayout from '@/components/global/FullOverflowLayout';
import Pagination from '@/components/global/Pagination';
import useWindowSize from '@/hooks/useWindowSize';
import Layout from '@/layout/Layout';
import { get_ticket } from '@/services/ticket.service';
import { useBranchesStore } from '@/store/branches.store';
import { useTicketStore } from '@/store/ticket.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { DetailSale } from '@/types/ticket.types';
import { formatDate } from '@/utils/dates';
import { formatCurrency } from '@/utils/dte';
import DivGlobal from '@/themes/ui/div-global';
import RenderViewButton from '@/components/global/render-view-button';
import { limit_options } from '@/utils/constants';
import { TableComponent } from '@/themes/ui/table-ui';
import LoadingTable from '@/components/global/LoadingTable';

function TicketSales() {
  //unused component
  const [dateInitial, setDateInitial] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());
  const [branch, setBranch] = useState(0);
  const [limit, setLimit] = useState(5);

  const { branch_list, getBranchesList } = useBranchesStore();

  const { windowSize } = useWindowSize();
  const [view, setView] = useState<'table' | 'grid' | 'list'>(windowSize.width < 768 ? 'grid' : 'table');

  useEffect(() => {
    getBranchesList();
  }, []);

  const { ticketPagination, tickets, onGetTickets, isLoading, totalSales } = useTicketStore();

  useEffect(() => {
    onGetTickets(1, limit, dateInitial, endDate, branch);
  }, [dateInitial, endDate, branch, limit]);

  const showFullLayout = useDisclosure();
  const [pdf, setPdf] = useState('');
  const [loadingPdf, setLoadingPdf] = useState(false);

  const handleShowPdf = (saleId: number) => {
    setLoadingPdf(true);
    showFullLayout.onOpen();
    get_ticket(saleId).then((res) => {
      const blob = generateTicket(res.data.detailSale);
      const url = URL.createObjectURL(blob);

      setPdf(url);
      setLoadingPdf(false);
    });
  };

  return (
    <Layout title="Ventas por Ticket">
      <>
        <DivGlobal>
          <Accordion isCompact defaultSelectedKeys={['1']} variant="splitted">
            <AccordionItem
              key="1"
              aria-label="Accordion 1"
              startContent={<Filter />}
              title="Filtros disponibles"
            >
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
                  value={dateInitial}
                  variant="bordered"
                  onChange={(e) => setDateInitial(e.target.value)}
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
                  value={endDate}
                  variant="bordered"
                  onChange={(e) => setEndDate(e.target.value)}
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

                      setBranch(branchId);
                    } else {
                      setBranch(0);
                    }
                  }}
                >
                  {branch_list.map((item) => (
                    <SelectItem key={item.id}>{item.name}</SelectItem>
                  ))}
                </Select>
              </div>
              <div className="flex flex-row justify-between mt-6 w-full">
                <RenderViewButton setView={setView} view={view} />
                <Select
                  className="w-44 dark:text-white border-white border rounded-xl"
                  classNames={{
                    label: 'font-semibold',
                  }}
                  defaultSelectedKeys={['5']}
                  label="Cantidad a mostrar"
                  labelPlacement="outside"
                  selectedKeys={[limit.toString()]}
                  value={limit}
                  variant="bordered"
                  onChange={(e) => {
                    setLimit(Number(e.target.value !== '' ? e.target.value : '5'));
                  }}
                >
                  {limit_options.map((limit) => (
                    <SelectItem key={limit} className="dark:text-white">
                      {limit}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-5 mt-3 pb-5">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 border dark:border-white rounded-xl">
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <Spinner />
                    </div>
                  ) : (
                    <span className="text-lg font-semibold text-slate-500 dark:text-slate-100">
                      Total de ventas: {formatCurrency(totalSales)}
                    </span>
                  )}
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 border dark:border-white rounded-xl">
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <Spinner />
                    </div>
                  ) : (
                    <span className="text-lg font-semibold text-slate-500 dark:text-slate-100">
                      Cantidad de tickets: {ticketPagination.total}
                    </span>
                  )}
                </div>
              </div>
            </AccordionItem>
          </Accordion>

            {view === 'table' && (
          <TableComponent
              headers={['Fecha - hora','Número de control','Sucursal','Punto de venta','Monto total','Acciones']}
            >
                  {isLoading ? (
                    <>
                      <tr>
                        <td className="p-3 text-sm text-center text-slate-500" colSpan={5}>
                          <LoadingTable/>
                        </td>
                      </tr>
                    </>
                  ) : (
                    <>
                      {tickets.map((sale, index) => (
                        <tr key={index} className="border-b border-slate-200">
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {sale.fecEmi} - {sale.horEmi}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {sale.numeroControl}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {sale.box.correlative.branch.name}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {sale.box.correlative.code}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {formatCurrency(Number(sale.montoTotalOperacion))}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            <ButtonUi
                              isIconOnly
                              theme={Colors.Info}
                              onPress={() => handleShowPdf(sale.id)}
                            >
                              <Eye />
                            </ButtonUi>
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
               </TableComponent>
            )}
            {view === 'grid' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {tickets.map((sale, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 dark:bg-gray-800 border dark:border-white rounded-xl"
                    >
                      <div className="flex flex-col justify-between">
                        <p className="text-lg font-semibold text-slate-500 dark:text-slate-100">
                          {sale.fecEmi} - {sale.horEmi}
                        </p>
                        <p className="text-lg font-semibold text-slate-500 dark:text-slate-100">
                          Total: {formatCurrency(Number(sale.montoTotalOperacion))}
                        </p>
                      </div>
                      <div className="flex flex-col justify-between">
                        <p className="text-lg font-semibold text-slate-500 dark:text-slate-100">
                          Sucursal: {sale.box.correlative.branch.name}
                        </p>
                        <p className="text-lg font-semibold text-slate-500 dark:text-slate-100">
                          Punto de venta: {sale.box.correlative.code}
                        </p>
                      </div>
                      <ButtonUi
                        isIconOnly
                        theme={Colors.Info}
                        onPress={() => handleShowPdf(sale.id)}
                      >
                        <Eye />
                      </ButtonUi>
                    </div>
                  ))}
                </div>
              </>
            )}
          
          {!isLoading && ticketPagination.totalPag > 1 && (
            <div className="mt-5 w-full dark:bg-gray-900">
              <Pagination
                currentPage={ticketPagination.currentPag}
                nextPage={ticketPagination.prevPag}
                previousPage={ticketPagination.nextPag}
                totalPages={ticketPagination.totalPag}
                onPageChange={(page) => {
                  onGetTickets(page, limit, dateInitial, endDate, branch);
                }}
              />
            </div>
          )}
        </DivGlobal>
        <FullPageLayout show={showFullLayout.isOpen}>
          <div
            className={classNames(
              'w-[500px] min-h-96 p-8 flex flex-col justify-center items-center bg-white rounded-[25px] bg-gradient-to-b',
              'h-[95vh] w-[95vw] !p-0'
            )}
          >
            <div className="w-[95vw] h-[95vh] bg-white rounded-2xl">
              <Button
                isIconOnly
                className="absolute bottom-6 left-6"
                color="danger"
                onPress={() => showFullLayout.onClose()}
              >
                <X />
              </Button>
              {loadingPdf ? (
                <div className="w-full h-full flex flex-col justify-center items-center">
                  <div className="loader" />
                  <p className="mt-5 text-xl">Cargando...</p>
                </div>
              ) : (
                <iframe className="w-full h-full" src={pdf} title='pdf' />
              )}
            </div>
          </div>
        </FullPageLayout>
      </>
    </Layout>
  );
}

export default TicketSales;

function generateTicket(details: DetailSale[]) {
  const doc = new jsPDF();

  doc.setFontSize(12);
  doc.text('', 105, 10, { align: 'center' });

  const { transmitter } = details[0].sale.box.correlative.branch;
  const { branch } = details[0].sale.box.correlative;
  const { correlative } = details[0].sale.box;

  doc.setFontSize(10);
  doc.text(`${transmitter.nombre}`, 105, 16, { align: 'center' });
  doc.text(`${branch.name}`, 105, 22, { align: 'center' });
  doc.text(`${branch.address}`, 105, 28, { align: 'center' });
  doc.text(`No. Reg.: ${transmitter.nrc}`, 105, 34, { align: 'center' });
  doc.text(`NIT: ${transmitter.nit}`, 105, 40, { align: 'center' });
  doc.text('GIRO: ', 105, 52, { align: 'center' });
  doc.text(`FECHA: ${details[0].sale.fecEmi} - ${details[0].sale.horEmi}`, 105, 58, {
    align: 'center',
  });
  doc.text(`TICKET: ${details[0].sale.numeroControl}   CAJA: ${details[0].sale.box.id}`, 105, 64, {
    align: 'center',
  });

  let y = 70;

  doc.setFontSize(9);
  doc.text('Prod.', 10, y);
  doc.text('Cant.', 70, y);
  doc.text('Prec.', 90, y);
  doc.text('Desc.', 110, y);
  doc.text('Tot.', 140, y);

  y += 6;
  details.forEach((product) => {
    doc.text(product.branchProduct.product.name, 10, y);
    doc.text(String(product.cantidadItem), 70, y);
    doc.text(formatCurrency(Number(product.branchProduct.price)), 90, y);
    doc.text(
      formatCurrency(Number(product.montoDescu) < 0 ? 0 : Number(product.montoDescu)),
      110,
      y
    );
    doc.text(formatCurrency(Number(product.totalItem)), 140, y);
    y += 6;
  });

  y += 6;
  doc.line(10, y, 200, y); // Draw line
  y += 6;
  doc.text('Total Gravado', 10, y);
  doc.text(formatCurrency(+details[0].sale.montoTotalOperacion), 140, y);
  y += 6;
  doc.text('Total Exento', 10, y);
  doc.text(formatCurrency(0), 140, y);
  y += 6;
  doc.line(10, y, 200, y); // Draw line
  y += 6;
  doc.text('Total A Pagar', 10, y);
  doc.text(`${formatCurrency(+details[0].sale.montoTotalOperacion)}`, 140, y);
  y += 6;
  doc.text('G= GRAVADO', 10, y);
  doc.text('E=EXENTO', 140, y);

  y += 12;
  doc.setFontSize(10);
  doc.text('No. AUTORIZACION:', 105, y, { align: 'center' });
  y += 6;
  doc.text(`${correlative.resolution}`, 105, y, { align: 'center' });
  y += 6;
  doc.text(`FECHA: ${details[0].sale.fecEmi}`, 105, y, { align: 'center' });
  y += 6;
  doc.text(`RANGO: ${correlative.serie}${correlative.from}-${correlative.to}`, 105, y, {
    align: 'center',
  });
  y += 6;
  doc.text(
    `Le atendió: ${details[0].sale.employee.firstName + ' ' + details[0].sale.employee.firstLastName}`,
    105,
    y,
    { align: 'center' }
  );
  y += 12;
  doc.text('*** GRACIAS POR SU COMPRA ***', 105, y, { align: 'center' });
  y += 6;
  doc.text('LO ESPERAMOS PRONTO', 105, y, { align: 'center' });

  return doc.output('blob');
}
