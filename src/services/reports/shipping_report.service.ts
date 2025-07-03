import axios from 'axios';

import { get_token } from '@/storage/localStorage';
import { API_URL } from '@/utils/constants';
export interface ShippingReport {
  producto: string;
  produccion: number;
  ADMINISTRACION: number;
  'SUCURSAL-CENTRO': number;
  'SUCURSAL-ISSS': number;
  'SUCURSAL-SONZACATE': number;
  'SUCURSAL-NAHUIZALCO': number;
  'PRODUCTO TERMINADO': number;
  'BODEGA DE MATERIA PRIMA': number;
}

export interface GetShippingReport {
  ok: boolean;
  status: number;
  data: ShippingReport[];
}

export const get_shipping_report = (startDate: string, endDate: string) => {
  const token = get_token();

  return axios.get<GetShippingReport>(
    API_URL + `/referal-note/shipping-report?startDate=${startDate}&endDate=${endDate}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
