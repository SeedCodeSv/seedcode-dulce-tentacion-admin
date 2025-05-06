import axios from 'axios';

export const get_pdf_fe_cfe = (genCode: string) => {
  return axios.get<Blob>(import.meta.env.VITE_API_URL + `/pdf/cfe-fe/${genCode}`, {
    responseType: 'blob'
  });
};
