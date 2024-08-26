import * as yup from 'yup';

export const supplierSchemaNormal = yup.object().shape({
    nombre: yup.string().required('El nombre es obligatorio.'),

    tipoDocumento: yup.string().required('El tipo de documento es obligatorio.'),
    numDocumento: yup.string().when('tipoDocumento', {
        is: (tipoDocumento: string | undefined) => tipoDocumento === '13' || tipoDocumento === '36',
        then: (schema) =>
            schema.required('El número de documento es requerido').test({
                name: 'documentValidation',
                message: 'El número de documento no es válido',
                test: (value, context) => {
                    const { tipoDocumento } = context.parent;
                    if (tipoDocumento === '13') {
                        return /^[0-9]{9}$/.test(value || '');
                    } else if (tipoDocumento === '36') {
                        return /^[0-9]{14}$/.test(value || '');
                    }
                    return true;
                },
            }),
        otherwise: (schema) => schema.notRequired(),
    }),
    telefono: yup.string().required('El teléfono es obligatorio.')
        .matches(/^[0-9]+$/, 'El teléfono debe ser numérico.'),
    correo: yup.string().email('Debe ser un correo válido.').required('El correo es obligatorio.'),
    departamento: yup.string().required('El departamento es requerido'),
    municipio: yup.string().required('El municipio es requerido'),
    complemento: yup.string().notRequired(),

});


export const supplierSchemaContribuyente = yup.object().shape({
    nombre: yup.string().required('El nombre es obligatorio.'),

    tipoDocumento: yup.string().required('El tipo de documento es obligatorio.'),
    numDocumento: yup.string().when('tipoDocumento', {
        is: (tipoDocumento: string | undefined) => tipoDocumento === '13' || tipoDocumento === '36',
        then: (schema) =>
            schema.required('El número de documento es requerido').test({
                name: 'documentValidation',
                message: 'El número de documento no es válido',
                test: (value, context) => {
                    const { tipoDocumento } = context.parent;
                    if (tipoDocumento === '13') {
                        return /^[0-9]{9}$/.test(value || '');
                    } else if (tipoDocumento === '36') {
                        return /^[0-9]{14}$/.test(value || '');
                    }
                    return true;
                },
            }),
        otherwise: (schema) => schema.notRequired(),
    }),
    telefono: yup.string().required('El teléfono es obligatorio.')
        .matches(/^[0-9]+$/, 'El teléfono debe ser numérico.'),
    correo: yup.string().email('Debe ser un correo válido.').required('El correo es obligatorio.'),
    departamento: yup.string().required('El departamento es requerido'),
    municipio: yup.string().required('El municipio es requerido'),
    complemento: yup.string().notRequired(),


    nombreComercial: yup.string().when('esContribuyente', (esContribuyente, schema) =>
        esContribuyente ? schema.required('El nombre comercial es obligatorio.') : schema.notRequired()
    ),
   
    nrc: yup.string().when('esContribuyente', (esContribuyente, schema) =>
        esContribuyente ? schema.required('El NRC es obligatorio.') : schema.notRequired()
    ),
    nit: yup.string().when('esContribuyente', (esContribuyente, schema) =>
        esContribuyente ? schema.required('El NIT es obligatorio.') : schema.notRequired()
    ),

    descActividad: yup.string().when('esContribuyente', (esContribuyente, schema) =>
        esContribuyente ? schema.required('La descripción de la actividad es obligatoria.') : schema.notRequired()
    ),

});

