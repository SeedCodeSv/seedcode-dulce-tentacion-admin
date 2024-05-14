import axios from 'axios'
import { IResponseContigence } from '../types/report_contigence';
import { API_URL } from '../utils/constants';

export const  get_contigence_report = (id : number , page : number , limit : number) => {
    return axios.get<IResponseContigence>(
      API_URL + `/sales/get-contigencia/${id}?page=${page}&limit=${limit}`
    );
}   