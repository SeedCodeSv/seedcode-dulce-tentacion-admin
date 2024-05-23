import axios from 'axios';
import { Cat012Departamento } from '../../types/billing/cat-012-departamento.types';
import { FACTURACION_API } from '../../utils/constants';

export const cat_012_departamento = () => {
  return axios.get<Cat012Departamento>(FACTURACION_API + '/cat-012-departamento');
};
