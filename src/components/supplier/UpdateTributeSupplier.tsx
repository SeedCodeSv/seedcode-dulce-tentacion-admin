import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';


import EditFormTributte from './edit-form-tributte';

import { useSupplierStore } from '@/store/supplier.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

function UpdateTributeSupplier() {
  const { id } = useParams();
  const { supplier, patchSupplier, OnGetBySupplier } = useSupplierStore();
  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState(supplier?.direccion?.departamento);

  useEffect(() => {
    if (id) {
      OnGetBySupplier(Number(id));
    }
  }, [id]);

  const formik = useFormik({
    initialValues: {
      nombre: '',
      correo: '',
      telefono: '',
      tipoDocumento: '',
      departamento: '',
      nombreDepartamento: '',
      nombreComercial: '',
      nit: '',
      nrc: '',
      numDocumento: '',
      esContribuyente: 1,
      municipio: '',
      nombreMunicipio: '',
      codCuenta: '',
      codActividad: '',
      descActividad: '',
      complemento: '',
    },
    validationSchema: yup.object().shape({
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
    }),
    onSubmit(values, formikHelpers) {
      patchSupplier(
        { ...values, esContribuyente: true, bienTitulo: supplier?.bienTitulo, id: supplier?.id },
        supplier?.id ?? 0
      );
      formikHelpers.setSubmitting(false);
      toast.success('Proveedor actualizado correctamente');
      navigate("/suppliers");
    },
  });

  useEffect(() => {
    if (supplier.direccion) {
      formik.setValues({
        nombre: supplier.nombre,
        nit: supplier.nit,
        nrc: supplier.nrc,
        telefono: supplier.telefono,
        correo: supplier.correo,
        departamento: supplier.direccion.departamento ?? '',
        nombreDepartamento: supplier.direccion.nombreDepartamento ?? '',
        municipio: supplier.direccion.municipio ?? '',
        nombreMunicipio: supplier.direccion.nombreMunicipio ?? '',
        complemento: supplier.direccion.complemento ?? '',
        nombreComercial: supplier.nombreComercial,
        descActividad: supplier.descActividad,
        numDocumento: supplier.numDocumento,
        codActividad: supplier.codActividad,
        codCuenta: supplier.codCuenta,
        esContribuyente: 1,
        tipoDocumento: supplier.tipoDocumento,
      });
    }
  }, [supplier.direccion]);

  return (
    <>
      <div className=" w-full h-full p-5 lg:pt-10">
        <div className="w-full h-full  border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
          <button className="w-32  flex gap-2 mb-4 cursor-pointer" onClick={() => navigate("/suppliers")}>
            <ArrowLeft className="dark:text-white" size={20} />
            <p className="dark:text-white">Regresar</p>
          </button>
          <form onSubmit={(e)=>{
            e.preventDefault()
            formik.handleSubmit(e)
          }}>
            <FormikProvider value={formik}>
              <EditFormTributte
                selectedDepartment={selectedDepartment}
                setSelectedDepartment={setSelectedDepartment}
              />
            </FormikProvider>
            <div className="flex gap-4 justify-between lg:justify-end w-full">
                <ButtonUi
                  className="mt-4 px-20 text-sm font-semibold"
                  theme={Colors.Error}
                  onPress={() => navigate('/suppliers')}
                >
                  Cancelar
                </ButtonUi>
                <ButtonUi
                  className="mt-4 px-20 text-sm font-semibold"
                  theme={Colors.Primary}
                  type="submit"
                >
                  Guardar
                </ButtonUi>
              </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default UpdateTributeSupplier;
