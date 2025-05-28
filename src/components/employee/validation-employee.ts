import * as yup from 'yup';

export const validationEmployeeSchema = yup.object().shape({
    firstName: yup.string().required('**Primer nombre es requerido**'),
    secondName: yup.string().required('**Segundo nombre es requerido**'),
    firstLastName: yup.string().required('**Primer apellido es requerido**'),
    secondLastName: yup.string().required('**Segundo apellido es requerido**'),
    bankAccount: yup.string().required('**Número de cuenta es requerido**'),
    dui: yup
      .string()
      .required('**Número de DUI es requerido**')
      .matches(/^\d{9}$/, '**Formato de DUI incorrecto**'),
    nit: yup
      .string()
      .notRequired()
      .matches(/^([0-9]{9}|[0-9]{14})$/, '**Formato de NIT incorrecto**'),
    afp: yup.string().notRequired(),
    phone: yup.string().required('**Número de telefono es requerido**'),
    age: yup.string().required('**Edad es requerida**'),
    salary: yup.string().required('**Salario es requerido**'),
    dateOfBirth: yup.string().required('**Fecha de nacimiento es requerida**'),
    dateOfEntry: yup.string().required('**Fecha de ingreso es requerida**'),
    code: yup.string().required('**Campo requerido**'),
    responsibleContact: yup.string().required('**Contacto responsable es requerido**'),
    studyLevelId: yup
      .number()
      .required('**Nivel de estudios es requerido**')
      .min(1, '**Nivel de estudios es requerido**'),
    statusId: yup.number().required('**Estatus es requerido**').min(1, '**Estatus es requerido**'),
    contractTypeId: yup
      .number()
      .required('**Tipo de contrato es requerido**')
      .min(1, '**Tipo de contrato es requerido**'),
    chargeId: yup.number().required('**Cargo es requerido**').min(1, '**Cargo es requerido**'),
    branchId: yup
      .number()
      .required('**Sucursal es requerida**')
      .min(1, '**Sucursal es requerida**'),
    department: yup.string().required('El departamento es requerido'),
    municipality: yup.string().required('El municipio es requerido'),
  });