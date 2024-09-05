import * as yup from 'yup';

export const supplierSchemaNormal = yup.object().shape({
  nombre: yup.string().required('**El nombre es obligatorio**'),

  tipoDocumento: yup.string().required('**El tipo de documento es obligatorio**'),

  numDocumento: yup
    .string()
    .required('**Número de documento es requerido, no debe tener guiones**')
    .test('noSelectedTypeDocument', '**Debe seleccionar un tipo de documento**', function () {
      const { tipoDocumento } = this.parent;
      return tipoDocumento !== '' ? true : false;
    })
    .test('validar-documento', '**Número de documento no válido, no debe tener guiones**', function (value) {
      const { tipoDocumento } = this.parent;
      if (tipoDocumento === '13') {
        return /^([0-9]{9})$/.test(value);
      }
      if (tipoDocumento === '36') {
        return value.length >= 9 && /^([0-9]{9}|[0-9]{14})$/.test(value);
      }
      return true; 
    }),
  telefono: yup
    .string()
    .required('**El teléfono es obligatorio**')
    .matches(/^[0-9]+$/, '**El teléfono debe ser numérico**'),
  correo: yup.string().email('Debe ser un correo válido.').required('**El correo es obligatorio**'),
  departamento: yup.string().required('**El departamento es requerido**'),
  municipio: yup.string().required('**El municipio es requerido**'),
  complemento: yup.string().required('**El complemento de la dirección es requerida**'),
});

export const supplierSchemaContribuyente = yup.object().shape({
  nombre: yup.string().required('**El nombre es obligatorio**'),
  tipoDocumento: yup.string().required('**El tipo de documento es obligatorio**'),
  numDocumento: yup
    .string()
    .required('**Número de documento es requerido**')
    .test('noSelectedTypeDocument', '**Debe seleccionar un tipo de documento**', function () {
      const { tipoDocumento } = this.parent;
      return tipoDocumento !== '' ? true : false;
    })
    .test('validar-documento', '**Número de documento no válido**', function (value) {
      const { tipoDocumento } = this.parent;
      if (tipoDocumento === '13') {
        return /^([0-9]{9})$/.test(value);
      }
      if (tipoDocumento === '36') {
        return value.length >= 9 && /^([0-9]{9}|[0-9]{14})$/.test(value);
      }
      return true; 
    }),
  telefono: yup
    .string()
    .required('**El teléfono es obligatorio**')
    .matches(/^[0-9]+$/, '**El teléfono debe ser numérico**'),
  correo: yup
    .string()
    .email('**Debe ser un correo válido**')
    .required('**El correo es obligatorio**'),
  departamento: yup.string().required('**El departamento es requerido**'),
  municipio: yup.string().required('**El municipio es requerido**'),
  complemento: yup.string().notRequired(),

  nombreComercial: yup
    .string()
    .when('esContribuyente', (esContribuyente, schema) =>
      esContribuyente
        ? schema.required('**El nombre comercial es obligatorio**')
        : schema.notRequired()
    ),

  nrc: yup
    .string()
    .when('esContribuyente', (esContribuyente, schema) =>
      esContribuyente ? schema.required('**El NRC es obligatorio**') : schema.notRequired()
    ),
  nit: yup
    .string()
    .when('esContribuyente', (esContribuyente, schema) =>
      esContribuyente
        ? schema.required('**El NIT es obligatorio sin guiones**')
        : schema.notRequired()
    ),

  descActividad: yup
    .string()
    .when('esContribuyente', (esContribuyente, schema) =>
      esContribuyente
        ? schema.required('**La descripción de la actividad es obligatoria**')
        : schema.notRequired()
    ),
});
