import axios from 'axios';

import { ICreateShippingProducts } from '../types/notes_of_remision.types';

export const generate_a_shipping_note = (payload: ICreateShippingProducts) => {
  return axios.post<{ ok: boolean }>(
    import.meta.env.VITE_API_URL + '/referal-note/transaction',
    payload
  );
};
