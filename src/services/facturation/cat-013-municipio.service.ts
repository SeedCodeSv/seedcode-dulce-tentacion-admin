import axios from 'axios';
import { Cat013Municipio } from '../../types/billing/cat-013-municipio.types';
import { FACTURACION_API } from '../../utils/constants';

export const cat_013_municipio = () => {
  return axios.get<Cat013Municipio>(FACTURACION_API + '/cat-013-municipio');
};
