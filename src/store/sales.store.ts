import { create } from 'zustand';
import { salesStore } from './types/sales.store.types';
import {
  get_factura_by_month,
  get_notes_of_sale,
  get_sale_details,
  get_sales_by_ccf,
  get_sales_by_item,
  get_sales_in_contingence,
  get_sales_status_and_dates,
  post_sales,
} from '../services/sales.service';
import { toast } from 'sonner';
import { messages, SPACES_BUCKET } from '../utils/constants';
import { calcularPorcentajeDescuento } from '../utils/filters';
import { s3Client } from '@/plugins/s3';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import axios from 'axios';
import { SVFC_CF_Firmado } from '@/types/svf_dte/cf.types';
export const useSalesStore = create<salesStore>((set, get) => ({
  sale_details: undefined,
  loading_creditos: false,
  creditos_by_month: [],
  factura_totals: 0,
  facturacion_ccfe: [],
  facturas_by_month: [],
  loading_sale: false,
  json_sale: undefined,
  json_sale_copy: undefined,
  sales_dates: [],
  sales_dates_pagination: {
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 0,
    ok: false,
  },
  loading_facturas: false,
  contingence_sales: [],
  saleByItem: [],
  loadingSalesByItem: false,
  getSaleByItem(transId, startDate, endDate) {
    set({ loadingSalesByItem: true });
    get_sales_by_item(transId, startDate, endDate)
      .then(({ data }) => {
        set({ saleByItem: data.data, loadingSalesByItem: false });
      })
      .catch(() => {
        set({ saleByItem: [], loadingSalesByItem: false });
      });
  },
  getCffMonth(branchId, month, year) {
    set({ loading_creditos: false });
    get_sales_by_ccf(branchId, month, year)
      .then(({ data }) => {
        set({
          creditos_by_month: data.salesCcf,
          factura_totals: data.totalFe,
          facturacion_ccfe: data.facturacionCcfe,
          loading_creditos: false,
        });
      })
      .catch(() => {
        set({
          creditos_by_month: [],
          facturacion_ccfe: [],
          factura_totals: 0,
          loading_creditos: false,
        });
      });
  },
  getFeMonth(branchId, month, year) {
    set({ loading_facturas: true });
    get_factura_by_month(branchId, month, year)
      .then((data) => {
        set({
          facturas_by_month: data.data.salesByDay,
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

  async getJsonSale(path) {
    set({ loading_sale: true });
    try {
      const url = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: SPACES_BUCKET,
          Key: path,
        })
      );
      axios
        .get<SVFC_CF_Firmado>(url, {
          responseType: 'json',
        })
        .then(({ data }) => {
          set({
            json_sale: {
              ...data,
              itemsCopy: data.cuerpoDocumento,
              indexEdited: [],
            },
            json_sale_copy: { ...data },
            loading_sale: false,
          });
        })
        .catch(() => {
          set({ json_sale: undefined });
        });
    } catch (error) {
      set({ loading_sale: false });
    }
  },

  getSaleDetails(id) {
    get_sale_details(id)
      .then(({ data }) => {
        get().getJsonSale(data.sale.pathJson);
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

  updateSaleDetails: (data) => set({ json_sale: data }),

  getSalesByDatesAndStatus(page = 1, limit = 5, branchId, startDate, endDate, state, type, point) {
    get_sales_status_and_dates(page, limit, branchId, startDate, endDate, state, type, point)
      .then((res) => {
        set({
          sales_dates: res.data.sales,
          sales_dates_pagination: {
            total: res.data.total,
            totalPag: res.data.totalPag,
            currentPag: res.data.currentPag,
            nextPag: res.data.nextPag,
            prevPag: res.data.prevPag,
            status: res.data.status,
            ok: res.data.ok,
          },
        });
      })
      .catch(() => {
        set({
          sales_dates: [],
          sales_dates_pagination: {
            total: 0,
            totalPag: 0,
            currentPag: 0,
            nextPag: 0,
            prevPag: 0,
            status: 0,
            ok: false,
          },
        });
      });
  },

  getNotesOfSale(id: number): Promise<{ debits: number; credits: number }> {
    return get_notes_of_sale(id)
      .then((res) => {
        if (res.data.ok === true) {
          return res.data.notes;
        } else {
          return {
            debits: 0,
            credits: 0,
          };
        }
      })
      .catch(() => {
        return {
          debits: 0,
          credits: 0,
        };
      });
  },

  getSalesInContingence(id) {
    get_sales_in_contingence(id)
      .then((res) => {
        set({
          contingence_sales: res.data.sales,
        });
      })
      .catch(() => {
        set({
          contingence_sales: [],
        });
      });
  },
}));
