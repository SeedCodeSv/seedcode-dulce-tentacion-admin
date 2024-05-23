import axios from 'axios';
import { FACTURACION_API } from '../../utils/constants';
import { IGetUnitOfMeasurement } from '../../types/billing/cat-014-tipos-de-medida.types';

export const get_units_of_measurement = () => {
  return axios.get<IGetUnitOfMeasurement>(FACTURACION_API + '/cat-014-unidad-de-medida');
};
