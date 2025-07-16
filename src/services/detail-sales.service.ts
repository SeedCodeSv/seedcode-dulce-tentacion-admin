import axios from 'axios';

import { GetSaleDetails } from '@/types/detail-sales.types';
import { API_URL } from '@/utils/constants';

export const get_details_sales = (id: number) => {
    return axios.get<GetSaleDetails>(API_URL + `/reports/details-sales/${id}`)
}