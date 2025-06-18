import { Button, Input, Select, SelectItem } from '@heroui/react';
import { ArrowLeft, Copy, Printer, Trash } from 'lucide-react';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { useBranchProductStore } from '../../store/branch_product.store';
import { global_styles } from '../../styles/global.styles';
import { IBranchProductOrder, PurchaseOrderPayload } from '../../types/purchase_orders.types';
import { usePurchaseOrdersStore } from '../../store/purchase_orders.store';
import NoData from '../global/NoData';
import AddButton from '../global/AddButton';
import useGlobalStyles from '../global/global.styles';
import EmptyTable from '../global/EmptyTable';
import TooltipGlobal from '../global/TooltipGlobal';

import Layout from '@/layout/Layout';
import { useViewsStore } from '@/store/views.store';
import { getElSalvadorDateTime } from '@/utils/dates';
import DivGlobal from '@/themes/ui/div-global';
import { TableComponent } from '@/themes/ui/table-ui';
import { IBranchProductOrderQuantity } from '@/types/branch_product_order.types';
import TdGlobal from '@/themes/ui/td-global';
function AddPurchaseOrders() {
  const {
    updateQuantityOrders,
    deleteProductOrder,
    orders_by_supplier,
    clearProductOrders,
    updatePriceOrders,
    onUpdateSupplier,
    onDuplicateProduct
  } = useBranchProductStore();
  const styles = useGlobalStyles();

  const handlePrint = (index: number) => {
    try {
      const order = orders_by_supplier[index];

      generatePDF(order.products, order.supplier.nombre);

      toast.success('Printing...');
    } catch {
      toast.error('Error...');

    }
  };

  const generatePDF = (products: IBranchProductOrderQuantity[], supplier: string) => {
    try {
      const doc = new jsPDF();

      doc.setFontSize(14);
      doc.text(`Proveedor: ${supplier}`, 10, 10);
      doc.text(
        `Fecha: ${getElSalvadorDateTime().fecEmi} - ${getElSalvadorDateTime().horEmi}`,
        10,
        20
      );

      // Datos de la tabla
      const data = [
        ...products.map((item) => ({
          No: item.id,
          Nombre: item.product.name,
          Cantidad: item.quantity,
          Codigo: item.product.code,
          Stock: item.stock,
          Precio: Number(item.costoUnitario),
        })),
      ];

      // Totales
      const total = data.reduce((acc, item) => acc + item.Precio, 0).toFixed(2);

      // Configuración de la tabla
      autoTable(doc, {
        head: [['No.', 'Nombre', 'Cantidad', 'Código', 'Stock', 'Precio']],
        body: data.map((item) => [
          item.No,
          item.Nombre,
          item.Cantidad,
          item.Codigo,
          item.Stock,
          `$ ${item.Precio.toLocaleString()}`,
        ]),
        startY: 30,
        theme: 'grid',
      });

      // Agregar totales
      doc.setFontSize(12);
      doc.text(
        `Total: $ ${total}`,
        10,
        (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10
      );

      // Guardar el archivo
      doc.save('reporte.pdf');
    }
    catch {
      toast.error('Error...al generar el pdf');

      return
    }
  };

  const { postPurchaseOrder } = usePurchaseOrdersStore();

  const handleSaveOrder = async () => {
    for (let i = 0; i < orders_by_supplier.length; i++) {
      const products: IBranchProductOrder[] = orders_by_supplier[i].products.map((prd) => ({
        branchProductId: prd.id,
        quantity: prd.quantity,
        unitPrice: Number(prd.costoUnitario),
        supplierId: Number(prd.supplier?.id),

      }));
      const branchId = orders_by_supplier[i].products[0].branchId;
      const total = products
        .map((p) => Number(p.unitPrice) * p.quantity)
        .reduce((a, b) => a + b, 0);
      const payload: PurchaseOrderPayload = {
        branchProducts: products,
        branchId,
        total,
      };

      await postPurchaseOrder(payload);
      navigate('/purchase-orders');
    }
    clearProductOrders();
  };
  const navigate = useNavigate();

  const { viewasAction } = useViewsStore();
  const viewSupplier = viewasAction.find((action) => action.view.name === 'Ordenes de Compra');
  const actions = viewSupplier?.actions.name || [];

  return (
    <Layout title="Lista de Ordenes de compra">
      {actions.includes('Agregar') ? (
        <DivGlobal>
          <div className="w-full flex items-center justify-between">
            <div
              className="flex items-center cursor-pointer"
            >
              <ArrowLeft
                className="dark:text-white mr-2"
                onClick={() => navigate('/purchase-orders')}
              />
              <p className="dark:text-white">Regresar</p>
            </div>

            <div className="flex  justify-end">
              <AddButton
                onClick={() => {
                  navigate('/add-product-purchase-order');
                }}
              />
            </div>
          </div>

          {orders_by_supplier.length === 0 && (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <NoData />
            </div>
          )}

          {orders_by_supplier.map((supplier, index) => (
            <div key={index} className="w-full">
              <TableComponent
                headers={[
                  'No.',
                  'Nombre',
                  'Proveedor',
                  'Cantidad',
                  'Código',
                  'Stock',
                  'Precio',
                  'Acciones',
                ]}
              >
                {supplier ? (
                  supplier.products.map((item, idx) => (
                    <tr key={idx}>
                      <TdGlobal className='p-3'>{idx + 1}</TdGlobal>
                      <TdGlobal>{item.product.name}</TdGlobal>
                      <TdGlobal className='py-3'>
                        <Select
                          className="w-72 dark:text-white"
                          classNames={{ label: 'font-semibold' }}
                          placeholder="Selecciona el proveedor"
                          selectedKeys={[Number(item.supplier?.id).toString()]}
                          size='sm'
                          variant="bordered"
                        >
                          {item.suppliers.map((sup) => (
                            <SelectItem
                              key={sup.id}
                              className="dark:text-white"
                              onPress={() => onUpdateSupplier(item.numItem, sup)}
                            >
                              {sup.nombre}
                            </SelectItem>
                          ))}
                        </Select>
                      </TdGlobal>
                      <TdGlobal>
                        <Input
                          className="w-32"
                          defaultValue={item.quantity.toString()}
                          lang="es"
                          type="number"
                          variant="bordered"
                          onChange={(e) => {
                            updateQuantityOrders(item.numItem, Number(e.target.value));
                          }}
                        />
                      </TdGlobal>
                      <TdGlobal>{item.product.code}</TdGlobal>

                      <TdGlobal>{item.stock}</TdGlobal>
                      <TdGlobal>
                        <Input
                          className="w-32 text-green-600"
                          defaultValue={item.price.toString()}
                          lang="es"
                          startContent="$"
                          type="number"
                          variant="bordered"
                          onChange={(e) => {
                            updatePriceOrders(item.numItem, Number(e.target.value));
                          }}
                        />
                      </TdGlobal>
                      <TdGlobal className="flex gap-3">
                        <TooltipGlobal text="Eliminar">
                          <Button
                            isIconOnly
                            style={global_styles().dangerStyles}
                            onPress={() => deleteProductOrder(item.numItem)}
                          >
                            <Trash size={18} />
                          </Button>
                        </TooltipGlobal>
                        <TooltipGlobal text="Duplicar fila">
                          <Button
                            isIconOnly
                            style={global_styles().warningStyles}
                            onPress={() => onDuplicateProduct(item)}
                          >
                            <Copy size={18} />
                          </Button>
                        </TooltipGlobal>
                      </TdGlobal>
                    </tr>
                  ))
                ) : (
                  <tr className="max-h-16">
                    <td className="py-6 text-center" colSpan={6}>
                      <EmptyTable />
                    </td>
                  </tr>
                )}
              </TableComponent>
              <div className="w-full py-5 flex justify-start">
                <Button style={global_styles().warningStyles} onPress={() => handlePrint(index)}>
                  <Printer />
                </Button>
              </div>
            </div>
          ))}

          <div className="w-full flex justify-end mt-4">
            <Button
              className="px-16 font-semibold"
              style={styles.darkStyle}
              onPress={() => handleSaveOrder()}
            >
              Guardar
            </Button>
          </div>
        </DivGlobal>
      ) : (
        <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
          <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent flex justify-center items-center">
            <p className="text-lg font-semibold dark:text-white">
              No tiene permisos para ver este modulo
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default AddPurchaseOrders;
