import { create } from 'zustand';
import { salesStore } from './types/sales.store.types';
import {
  get_factura_by_month,
  get_sale_details,
  get_sales_by_ccf,
  post_sales,
} from '../services/sales.service';
import { toast } from 'sonner';
import { messages } from '../utils/constants';
import { calcularPorcentajeDescuento } from '../utils/filters';
export const useSalesStore = create<salesStore>((set) => ({
  sale_details: undefined,
  loading_creditos: false,
  creditos_by_month: [],
  factura_totals: 0,
  facturas_by_month: [],
  loading_facturas: false,
  getCffMonth(branchId, month) {
    set({ loading_creditos: false });
    get_sales_by_ccf(branchId, month)
      .then(({ data }) => {
        set({
          creditos_by_month: data.salesCcf,
          factura_totals: data.totalFe,
          loading_creditos: false,
        });
      })
      .catch(() => {
        set({
          creditos_by_month: [],
          factura_totals: 0,
          loading_creditos: false,
        });
      });
  },
  getFeMonth(branchId, month) {
    set({ loading_facturas: true });
    get_factura_by_month(branchId, month)
      .then((data) => {
        set({
          facturas_by_month: data.data.salesByDay.filter((day) => day.firstCorrelative !== null),
          loading_facturas: false,
        });
      })
      .catch(() => {
        set({ facturas_by_month: [], loading_facturas: false });
      });
  },
  postSales: (pdf, dte, cajaId, codigoEmpleado, sello) => {
    post_sales(pdf, dte, cajaId, codigoEmpleado, sello)
      .then(() => {
        toast.success(messages.success);
      })
      .catch(() => {
        toast.error(messages.error);
      });
  },
  getSaleDetails(id) {
    get_sale_details(id)
      .then(({ data }) => {
        set({
          sale_details: {
            ...data.sale,

            details: data.sale.details.map((detail) => ({
              ...detail,
              isEdited: false,
              newTotalItem: detail.totalItem,
              porcentajeDescuento: calcularPorcentajeDescuento(
                Number(detail.totalItem),
                Number(detail.montoDescu)
              ),
              newMontoDescu: detail.montoDescu,
              newCantidadItem: detail.cantidadItem,
              newPorcentajeDescu: calcularPorcentajeDescuento(
                Number(detail.totalItem),
                Number(detail.montoDescu)
              ),
              branchProduct: {
                ...detail.branchProduct,
                newPrice: detail.branchProduct.price,
              },
            })),
          },
        });
      })
      .catch(() => {
        set({ sale_details: undefined });
      });
  },
  updateSaleDetails: (data) => set({ sale_details: data }),
}));
