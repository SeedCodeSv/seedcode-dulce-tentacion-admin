import { useEffect, useState } from 'react';
import { Autocomplete, AutocompleteItem, Button, Input, Spinner } from '@heroui/react';
import jsPDF from 'jspdf';
import classNames from 'classnames';
import { FileDown } from 'lucide-react';
import autoTable, { ThemeType } from 'jspdf-autotable';
import { toast } from 'sonner';

// import FilterInventoryMovement from '../reporters/report-products/filters/FilterInventoryMoement';
import useGlobalStyles from '../global/global.styles';
import TooltipGlobal from '../global/TooltipGlobal';
import { ResponsiveFilterWrapper } from '../global/ResposiveFilters';
import NoDataInventory from '../inventory_aqdjusment/NoDataInventory';

import { useAuthStore } from '@/store/auth.store';
import { fechaActualString } from '@/utils/dates';
import { useBranchesStore } from '@/store/branches.store';
import { formatCurrency } from '@/utils/dte';
import DEFAULT_LOGO from '@/assets/dulce-logo.png';
import { useTransmitterStore } from '@/store/transmitter.store';
import { global_styles } from '@/styles/global.styles';
import { useInventoryMovement } from '@/store/reports/inventory_movement.store';
import { hexToRgb, typesInventoryMovement } from '@/utils/utils';


interface Props {
  actions: string[];
}

function ListMovements({ actions }: Props) {
  const { user } = useAuthStore();
  const { transmitter, gettransmitter } = useTransmitterStore();
  const { OnGetInventoryMovement, inventoryMoments } = useInventoryMovement();

  const totalItemPerPageGraphic = 20;
  const styles = useGlobalStyles();
  const [loading, setLoading] = useState(false);

  const { branch_list, getBranchesList } = useBranchesStore();
  const [filter, setFilter] = useState({
    startDate: fechaActualString,
    endDate: fechaActualString,
    branch: '',
    typeOfInventory: '',
    typeOfMoviment: '',
  });

  useEffect(() => {
    OnGetInventoryMovement(
      user?.transmitterId ?? 0,
      1,
      40,
      filter.startDate,
      filter.endDate,
      filter.branch,
      filter.typeOfInventory,
      filter.typeOfMoviment
    );
    getBranchesList();
  }, []);

  useEffect(() => {
    gettransmitter();
  }, []);

  const handleAutocompleteChange = (name: string, value: string) => {
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const backgroundColorRGB = hexToRgb(styles.darkStyle.backgroundColor || '#0d83ac');
  const textColorRGB = hexToRgb(styles.secondaryStyle.color || '#FFFFFF');

  const downloadPDF = () => {
    setLoading(true);
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 1.5;

    // margin
    const drawMargins = () => {
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
    };

    drawMargins();

    // Logo
    const logoWidth = 20;
    const logoHeight = 20;
    const marginheader = 15
    const logoX = pageWidth - logoWidth - margin - marginheader;
    const logoY = 10;

    doc.addImage(DEFAULT_LOGO, 'PNG', logoX, logoY, logoWidth, logoHeight);

    doc.setFontSize(12);
    doc.text(`Movimientos de inventario del ${filter.startDate} al ${filter.endDate}`, marginheader, 15);

    doc.setFontSize(8);
    doc.text(`${transmitter.nombreComercial}`, marginheader, 24);
    doc.text(`${transmitter.nombre}`, marginheader, 20);
    doc.text(
      `${transmitter.direccion.nombreMunicipio}/${transmitter.direccion.nombreDepartamento}-${transmitter.direccion.complemento}`,
      marginheader,
      28
    );

    const tableData = inventoryMoments.map((movements) => [
      movements?.branchProduct?.product?.name,
      movements?.typeOfMovement,
      movements?.typeOfInventory,
      movements?.quantity,
      movements?.date,
      movements?.time,
      formatCurrency(+movements?.totalMovement),
    ]);
    const columns = [
      'Nombre',
      'Tipo de movimiento',
      'Tipo de inventario',
      'Cantidad',
      'Fecha',
      'Hora',
      'Total',
    ];

    autoTable(doc, {
      head: [columns],
      body: tableData,
      startY: 38,
      theme: 'grid' as ThemeType,
      styles: { fontSize: 8, cellPadding: 1.5 },
      headStyles: {
        fillColor: backgroundColorRGB as [number, number, number],
        textColor: textColorRGB as [number, number, number],
      },
      alternateRowStyles: { fillColor: [225, 225, 225] },
      didDrawPage: () => {
        drawMargins();
      },
    });

    doc.save(`movimientos_inventario_${filter.startDate}_${filter.endDate}.pdf`);
    setLoading(false);
  };

  return (
    <div className="w-[99%] h-full p-2 md:pt-5 bg-gray-50 dark:bg-gray-800">
      <div className="w-full h-full p-5 md:p-5 mt-2 overflow-y-auto bg-white custom-scrollbar shadow border dark:bg-gray-900">
        <div className="">
          <ResponsiveFilterWrapper onApply={() => OnGetInventoryMovement(
            user?.transmitterId ?? 0,
            1,
            totalItemPerPageGraphic,
            filter.startDate,
            filter.endDate,
            filter.branch,
            filter.typeOfInventory,
            filter.typeOfMoviment
          )}>
            <Input
              className="dark:text-white"
              classNames={{ base: 'font-semibold' }}
              defaultValue={filter.startDate}
              label="Fecha inicial"
              labelPlacement="outside"
              type="date"
              value={filter.startDate}
              variant="bordered"
              onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
            />

            <Input
              className="dark:text-white"
              classNames={{ base: 'font-semibold' }}
              defaultValue={filter.endDate}
              label="Fecha final"
              labelPlacement="outside"
              type="date"
              value={filter.endDate}
              variant="bordered"
              onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
            />

            <div className="w-full">
              <Autocomplete
                className="dark:text-white"
                classNames={{ base: 'font-semibold' }}
                clearButtonProps={{ onClick: () => handleAutocompleteChange('branch', '') }}
                label="Sucursal"
                labelPlacement="outside"
                placeholder="Selecciona la Sucursal"
                variant="bordered"
                onClear={() => handleAutocompleteChange('branch', '')}
              >
                {branch_list.map((branch) => (
                  <AutocompleteItem
                    key={branch.id}
                    className="dark:text-white"
                    onPress={() => {
                      handleAutocompleteChange('branch', branch.name);
                    }}

                  >
                    {branch.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
            <div className="w-full">
              <Autocomplete
                className="dark:text-white"
                classNames={{ base: 'font-semibold' }}
                clearButtonProps={{ onClick: () => handleAutocompleteChange('typeOfMoviment', '') }}
                label="Tipo "
                labelPlacement="outside"
                placeholder="Selecciona el Tipo"
                variant="bordered"
              >
                {typesInventoryMovement.map((e) => (
                  <AutocompleteItem
                    key={e.id}
                    className="dark:text-white"
                    onPress={() => handleAutocompleteChange('typeOfMoviment', e.type)}
                  >
                    {e.type}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
          </ResponsiveFilterWrapper>
        </div>
        <div className="flex items-center gap-3">
          {actions.includes('Descargar PDF') && (
            <TooltipGlobal text="Descargar PDF">
              <Button
                className="hidden md:flex mt-3"
                disabled={loading}
                style={global_styles().thirdStyle}
                onPress={() => {
                  inventoryMoments.length > 0
                    ? downloadPDF()
                    : toast.error('No hay movimientos para descargar');
                }}
              >
                {' '}
                {loading ? <Spinner /> : <FileDown />}
              </Button>
            </TooltipGlobal>
          )}
        </div>
          <div className="max-h-[60vh] xl:flex md:flx hidden min-h-32 overflow-y-auto overflow-x-auto custom-scrollbar mt-6">
            <table className="w-full">
              <thead className="sticky top-0 z-20 bg-white">
                <tr>
                  {['Nombre', 'Tipo de Movimiento', 'Motivo', 'Cantidad', 'Fecha', 'Hora', 'Total de Movimiento'].map((header) =>
                    <th
                      key={header}
                      className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                      style={styles.darkStyle}
                    >
                      {header}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="max-h-[400px] w-full overflow-y-auto">
                {inventoryMoments.length > 0 ? (
                  <>
                    {inventoryMoments.map((product, index) => (
                      <tr key={index} className="border-b dark:border-slate-600 border-slate-200">
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {product?.branchProduct?.product?.name}
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {product.typeOfMovement}
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {product.typeOfInventory}
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {product.quantity}
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {product.date}
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {product.time}
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {formatCurrency(Number(product.totalMovement))}
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td colSpan={7}>
                      <NoDataInventory title="No se encontraron  movimientos" />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
       
        {inventoryMoments.length > 0 ? (
          <div className="w-full xl:hidden  mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
            {inventoryMoments.map((product) => (
              <div
                key={product.id}
                className={classNames(
                  'w-full shadow dark:border border-gray-600 hover:shadow-lg p-5 rounded-2xl'
                )}
              >
                <p className="dark:text-white font-semibold">
                  Nombre : {product?.branchProduct?.product?.name}
                </p>
                <div className="flex justify-between w-full gap-2 mt-2">
                  <p className="dark:text-white">Tipo : {product.typeOfMovement}</p>
                  <p className="dark:text-white">Motivo : {product.typeOfInventory}</p>
                </div>

                <div className="flex w-full justify-between gap-2 mt-3 ">
                  <p className="dark:text-white flex items-center justify-center">
                    Fech : {product.date}
                  </p>
                  <p className="dark:text-white flex items-center justify-center">
                    Hora : {product.time}
                  </p>
                </div>
                <div className="flex justify-between mt-5 w-ful">
                  <p className="dark:text-white">Cantidad : {product.quantity}</p>
                  <p className="text-green-500 font-semibold">Total : ${product.totalMovement}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="md:flex flex xl:hidden justify-center items-end">
            <NoDataInventory title="No se encontraron  movimientos" />
          </div>
        )}
      </div>
    </div>
  );
}

export default ListMovements;
