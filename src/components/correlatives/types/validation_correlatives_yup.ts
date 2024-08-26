import * as yup from 'yup';

export const validation_correlatives = yup.object().shape({
  code: yup.string().required('** Campo requerido **'),
  typeVoucher: yup.string().required('** Campo requerido **'),
  resolution: yup.string().required('** Campo requerido **'),
  from: yup.string().required('** Campo requerido **'),
  to: yup.string().required('** Campo requerido **'),
  next: yup.number().required('** Campo requerido **'),
  prev: yup.number().required('** Campo requerido **'),
  serie: yup.string().required('** Campo requerido **'),
  branchId: yup.number().required('** Campo requerido **'),
});
