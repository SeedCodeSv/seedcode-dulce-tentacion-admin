import axios from 'axios';

import { ICreateShippingProducts } from '../types/notes_of_remision.types';
import { CHECK_NUM_EXIST } from '../types/shipping_branch_product.types';

import { API_URL, VITE_MH_FILTERS } from '@/utils/constants';
import { BasicResponse } from '@/types/global.types';

export const generate_a_shipping_note = (payload: ICreateShippingProducts) => {
  return axios.post<{ ok: boolean }>(
    import.meta.env.VITE_API_URL + '/referal-note/transaction',
    payload
  );
};

export const check_sale_numControl = (numControl: string) => {
  return axios.get<BasicResponse>(API_URL + `/sales?numControl=${numControl}`)
}

export const check_if_numcontrol_exist = (
  numControl: string,
  nitEmision: string,
  duiEmision: string,
  token: string
) => {
  return axios.post<CHECK_NUM_EXIST>(
    VITE_MH_FILTERS,
    {
      numeroControl: numControl,
      nitEmision,
      duiEmision,
      tipoRpt: 'E'
    },
    {
      headers: {
        Authorization: token
      }
    }
  )
}