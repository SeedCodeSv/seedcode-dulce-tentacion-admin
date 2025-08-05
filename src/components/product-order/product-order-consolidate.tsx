/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Autocomplete,
  AutocompleteItem,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Input,
  Select,
  SelectItem,
  useDisclosure,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import {
  CalendarDays,
  Clock,
  Eye,
  Hash,
  Info,
  ReceiptText,
  ShoppingCart,
  StickyNote,
  Store,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { PiFilePdfDuotone, PiMicrosoftExcelLogo } from 'react-icons/pi';
import axios from 'axios';
import { toast } from 'sonner';

import EmptyTable from '../global/EmptyTable';
import { ResponsiveFilterWrapper } from '../global/ResposiveFilters';
import Pagination from '../global/Pagination';
import RenderViewButton from '../global/render-view-button';

import { RenderStatus, Status, StautsProductOrder } from './render-order-status';
import { exportToExcelOrderProduct } from './exportExcel';
import { exportToPDFOrderProduct, IOrderProduct } from './exportPdf';
import CardProductOrderComponent from './card-product-order-component';

import ButtonUi from '@/themes/ui/button-ui';
import DivGlobal from '@/themes/ui/div-global';
import TdGlobal from '@/themes/ui/td-global';
import useColors from '@/themes/use-colors';
import { Order } from '@/types/order-products.types';
import { useOrderProductStore } from '@/store/order-product.store';
import { Colors } from '@/types/themes.types';
import Pui from '@/themes/ui/p-ui';
import { TableComponent } from '@/themes/ui/table-ui';
import { getElSalvadorDateTime } from '@/utils/dates';
import { API_URL, limit_options } from '@/utils/constants';
import { useBranchesStore } from '@/store/branches.store';
import { useShippingBranchProductBranch } from '@/shopping-branch-product/store/shipping_branch_product.store';
import { useProductionOrderStore } from '@/store/production-order.store';
import useWindowSize from '@/hooks/useWindowSize';
import { useTransmitterStore } from '@/store/transmitter.store';
import { ReportBranchProductStore } from '@/store/report-branch-product.store';
import { serialize } from 'v8';
import { exportToExcelBranchProductReport } from './ExportExcelBranchProduct';
import { exportToPDFBranchProductReport } from './ExportPdfBranchProduct';

export default function ProductOrderConsolidate() {
  // const { backgroundColor, textColor } = useColors();
  const { getBranchesList, branch_list } = useBranchesStore();
  const { getReportBranchProduct, data_report } = ReportBranchProductStore();
  // const { addSelectedProducts } = useProductionOrderStore();
  const [selectedOrder, setSelectedOrder] = useState<Order>();
  const { transmitter, gettransmitter } = useTransmitterStore()
  // const { getOrdersByDates, ordersProducts } = useOrderProductStore();
  const currentDate = new Date();
  const defaultStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const modalDetails = useDisclosure();
  const { windowSize } = useWindowSize()
  const [view, setView] = useState<'table' | 'grid' | 'list'>(
    windowSize.width < 768 ? 'grid' : "table"
  )
  const [search, setSearch] = useState({
    name: '',
    branch: ''
  });

  // const [selectedIds, setSelectedIds] = useState<number[]>([]);



  useEffect(() => {
    getReportBranchProduct(search.name, search.branch)
  }, [search.name, search.branch]);

  useEffect(() => {
    gettransmitter()
    getBranchesList()
  }, [])


  // const getStatusColor = (status: string): string => {
  //   switch (status.toLowerCase()) {
  //     case 'abierta':
  //       return 'bg-blue-100 text-blue-800';
  //     case 'cerrada':
  //       return 'bg-green-100 text-green-800';
  //     case 'cancelada':
  //       return 'bg-red-100 text-red-800';
  //     case 'en proceso':
  //       return 'bg-yellow-100 text-yellow-800';
  //     default:
  //       return 'bg-gray-100 text-gray-800';
  //   }
  // };

  const handleSearch = () => {
    getReportBranchProduct(search.name, search.branch);
  };



  // const getOrderProductReport = async (): Promise<IOrderProduct[]> => {
  //   try {
  //     const response = await axios.post(API_URL + '/order-product/order-report-consolidate', {
  //       startDate: search.startDate,
  //       endDate: search.endDate,
  //       ids: selectedIds,
  //     });

  //     const responseData =
  //       typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

  //     return responseData.data;
  //   } catch (error) {
  //     toast.error('Errr al obtener los datos');
  //     throw error;
  //   }
  // };

  const exportExcel = async () => {
    try {
      // const reportData = await getOrderProductReport();

      if (data_report && data_report.length > 0) {
        await exportToExcelBranchProductReport(data_report, transmitter);
        toast.success('Exportado con éxito');
      } else {
        toast.error('No hay datos para exportar');
      }
    } catch (error) {
      toast.error('Error al exportar: ' + (error as Error).message);
    }
  };

  const exportPdf = async () => {
    try {
      // const reportData = await getOrderProductReport();

      if (data_report && data_report.length > 0) {
        await exportToPDFBranchProductReport(data_report, transmitter);
        toast.success('Exportado con éxito');
      } else {
        toast.error('No hay datos para exportar');
      }
    } catch (error) {
      toast.error('Error al exportar: ' + (error as Error).message);
    }
  };

  return (
    <DivGlobal>
      <ResponsiveFilterWrapper
        classButtonLg="col-start-5"
        classLg="w-full grid grid-cols-3 gap-4 items-end mb-2"
        onApply={() => handleSearch()}
      >
        <Autocomplete
          className="font-semibold dark:text-white w-full"
          defaultSelectedKey={String(search.branch)}
          label="Sucursales"
          labelPlacement="outside"
          placeholder="Selecciona la sucursal"
          variant="bordered"
          onClose={() => {
            setSearch({
              ...search,
              branch: ""
            })
          }}
          onSelectionChange={(key) => {
            const newBranchId = String(key);

            setSearch({
              ...search,
              branch: newBranchId,
            });
          }}
        >
          {branch_list.map((branch) => (
            <AutocompleteItem key={branch.name} className="dark:text-white">
              {branch.name}
            </AutocompleteItem>
          ))}
        </Autocomplete>




      </ResponsiveFilterWrapper>
      <div className="flex gap-4 mt-1">

        <ButtonUi
          startContent={<PiMicrosoftExcelLogo className="" size={25} />}
          theme={Colors.Success}
          onPress={() => {
            exportExcel();
          }}
        >
          Exportar a excel
        </ButtonUi>
        <ButtonUi
          startContent={<PiFilePdfDuotone className="" size={25} />}
          theme={Colors.Error}
          onPress={() => {
            exportPdf();
          }}
        >
          Exportar a pdf
        </ButtonUi>
        <RenderViewButton setView={setView} view={view} />
      </div>
      {view === 'table' && (
        <TableComponent
          headers={[
            'No.',
            'Producto',
            'Codigo',
            'Sucursal',
            'Stock',
            // 'Estado',
            // 'Acciones',
          ]}
        >
          {data_report.length === 0 && (
            <tr className="border-b border-slate-200">
              <td
                className="p-2 text-sm text-slate-500 w-full font-medium dark:text-slate-100"
                colSpan={7}
              >
                <EmptyTable />
              </td>
            </tr>
          )}
          {data_report.map((order, index) => (
            <tr key={index} className=" cursor-pointer">
              <TdGlobal className="p-2 text-sm">
                {/* <Checkbox
                  key={order.branchProductId}
                  checked={selectedIds.includes(order.id)}
                  onValueChange={() => handleCheckboxChange(order.id)}
                /> */}
              </TdGlobal>
              <TdGlobal className="p-2 text-sm">{order.producto}</TdGlobal>
              <TdGlobal className="p-2 text-sm">
                {order.code}
              </TdGlobal>
              <TdGlobal className="p-2 text-sm">{order.branch}</TdGlobal>
              <TdGlobal className="p-2 text-sm">
                {order.stock}
              </TdGlobal>
              {/* <TdGlobal className="p-2 text-sm">
                {RenderStatus({ status: order.status as Status }) || order.status}
              </TdGlobal> */}
              {/* <TdGlobal */}
            </tr>
          ))}
        </TableComponent>
      )}

      {/* {view === 'grid' && (
        <CardProductOrderComponent
          addSelectedProducts={addSelectedProducts}
          handleCheckboxChange={handleCheckboxChange}
          handleDetails={handleDetails}
          selectedIds={selectedIds}
          onAddBranchDestiny={onAddBranchDestiny}
          onAddBydetail={onAddBydetail}
          onAddOrderId={onAddOrderId}
        />
      )} */}



    </DivGlobal>
  );
}
