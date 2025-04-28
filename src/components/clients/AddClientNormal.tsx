import { Autocomplete, AutocompleteItem, Input, Textarea } from "@heroui/react";
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as yup from 'yup';
import { Formik } from 'formik';
import { Loader } from 'lucide-react';

import { useCustomerStore } from '@/store/customers.store';
import { useBillingStore } from '@/store/facturation/billing.store';
import { PayloadCustomer } from '@/types/customers.types';
import { useViewsStore } from '@/store/views.store';
import { Municipio } from '@/types/billing/cat-013-municipio.types';
import { Departamento } from '@/types/billing/cat-012-departamento.types';
import { useBranchesStore } from '@/store/branches.store';
import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";

const AddClientNormal = () => {
  const { getBranchesList, branch_list } = useBranchesStore();

  useEffect(() => {
    getBranchesList();
  }, []);
  const { postCustomer, getCustomerById, customer, loading, patchCustomer } = useCustomerStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedCodeDep, setSelectedCodeDep] = useState('0');
  const {
    getCat012Departamento,
    cat_012_departamento,
    getCat013Municipios,
    cat_013_municipios,
    getCat022TipoDeDocumentoDeIde,
    cat_022_tipo_de_documentoDeIde,
  } = useBillingStore();

  useEffect(() => {
    getCustomerById(Number(id));
    getCat012Departamento();
  }, []);

  useEffect(() => {
    customer && getCat013Municipios(customer.direccion.departamento);
  }, [customer]);

  useEffect(() => {
    getCat013Municipios(selectedCodeDep);
    getCat022TipoDeDocumentoDeIde();
  }, [selectedCodeDep]);

  const initialValues = {
    nombre: customer?.nombre ?? '',
    correo: customer?.correo ?? '',
    telefono: customer?.telefono ?? '',
    numDocumento: customer?.numDocumento ?? '',
    municipio: customer?.direccion?.municipio ?? '',
    tipoDocumento: customer?.tipoDocumento ?? '',
    nombreMunicipio: customer?.direccion?.nombreMunicipio ?? '',
    departamento: customer?.direccion?.departamento ?? '',
    nombreDepartamento: customer?.direccion?.nombreDepartamento ?? '',
    complemento: customer?.direccion?.complemento ?? '',
    branchId: customer?.branch?.id,
  };

  const validationSchema = yup.object().shape({
    nombre: yup.string().required('**El nombre es requerido**'),
    correo: yup.string().required('**El correo es requerido**').email('**El correo es invalido**'),
    tipoDocumento: yup.string(),
    numDocumento: yup
      .string()
      .notRequired()
      .test('noSelectedTypeDocument', '**Debe seleccionar un tipo de documento**', function () {
        const { tipoDocumento } = this.parent;

        return tipoDocumento !== '';
      })
      .test('validar-documento', '**Número de documento no válido, no debe contener guiones**', function (value) {
        const { tipoDocumento } = this.parent;

        if (tipoDocumento === '13') {
          return /^([0-9]{9})$/.test(value || '');
        }

        if (tipoDocumento === '36') {
          return value ? value.length >= 9 && /^([0-9]{9}|[0-9]{14})$/.test(value) : false;
        }

        return true;
      }),

    departamento: yup.string().required('**Debes seleccionar el departamento**'),
    municipio: yup.string().required('**Debes seleccionar el municipio**'),
    complemento: yup.string(),
    branchId: yup.number().required('**Debes seleccionar la sucursal**'),
  });

  const [isClicked, setIsClicked] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  const onSubmit = (payload: PayloadCustomer) => {
    if (Number(id) > 0 || Number(id) !== 0) {
      const values = {
        ...payload,
        esContribuyente: 0,
      };

      patchCustomer(values, Number(id))
        .then((res) => {
          setIsClicked(false);
          res && navigate('/clients');
          if (button.current) button.current.disabled = false;
        })
        .catch(() => {
          if (button.current) button.current.disabled = false;
        });
    } else {
      const values = {
        ...payload,
        tipoDocumento: payload.tipoDocumento || 'N/A',
        numDocumento: payload.numDocumento || 'N/A',
        telefono: payload.telefono || 0,
        esContribuyente: 0,
      };

      postCustomer(values)
        .then((res) => {
          setIsClicked(false);
          res && navigate('/clients');
          if (button.current) button.current.disabled = false;
        })
        .catch(() => {
          if (button.current) button.current.disabled = false;
        });
    }
  };
  const { viewasAction } = useViewsStore();
  const viewClientNormal = viewasAction.find((action) => action.view.name === 'Clientes');
  const actions = viewClientNormal?.actions.name || ['Agregar'];

  return (
    <>
      {actions.includes('Agregar') ? (
        <div className=" dark:bg-gray-900">
          {loading ? (
            <strong>Cargando...</strong>
          ) : (
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values) => onSubmit(values)}
            >
              {({
                values,
                touched,
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                validateForm,
              }) => (
                <>
                  <div className="">
                    <div className="pt-2">
                      <Input
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                          input: 'dark:text-white',
                          base: 'font-semibold',
                        }}
                        errorMessage={errors.nombre}
                        isInvalid={!!errors.nombre && !!touched.nombre}
                        label="Nombre"
                        labelPlacement="outside"
                        name="nombre"
                        placeholder="Ingresa el nombre"
                        value={values.nombre}
                        variant="bordered"
                        onBlur={handleBlur('nombre')}
                        onChange={handleChange('nombre')}
                      />
                    </div>
                    <div className="pt-3">
                      <Input
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                          input: 'dark:text-white',
                          base: 'font-semibold',
                        }}
                        errorMessage={errors.correo}
                        isInvalid={!!errors.correo && !!touched.correo}
                        label="Correo electrónico"
                        labelPlacement="outside"
                        name="correo"
                        placeholder="Ingresa el correo"
                        value={values.correo}
                        variant="bordered"
                        onBlur={handleBlur('correo')}
                        onChange={handleChange('correo')}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-5 pt-3">
                      <div>
                        <Autocomplete
                          className="dark:text-white"
                          classNames={{
                            base: 'font-semibold text-gray-500 text-sm',
                          }}
                          errorMessage={errors.tipoDocumento}
                          isInvalid={!!errors.tipoDocumento && !!touched.tipoDocumento}
                          label="Tipo de documento"
                          labelPlacement="outside"
                          placeholder="Selecciona el tipo de documento"
                          selectedKey={values.tipoDocumento}
                          variant="bordered"
                          onBlur={handleBlur('tipoDocumento')}
                          onSelectionChange={(key) => {
                            if (key) {
                              setFieldValue('tipoDocumento', key as string);
                            }
                          }}
                        >
                          {cat_022_tipo_de_documentoDeIde.map((dep) => (
                            <AutocompleteItem
                              key={dep.codigo}
                              className="dark:text-white"
                            >
                              {dep.valores}
                            </AutocompleteItem>
                          ))}
                        </Autocomplete>
                      </div>
                      <div>
                        <Input
                          classNames={{
                            label: 'font-semibold text-gray-500 text-sm',
                            input: 'dark:text-white',
                            base: 'font-semibold',
                          }}
                          errorMessage={errors.numDocumento}
                          isInvalid={!!errors.numDocumento && !!touched.numDocumento}
                          label="Numero documento"
                          labelPlacement="outside"
                          name="numDocumento"
                          placeholder="Ingresa el numero documento"
                          type="text"
                          value={values.numDocumento}
                          variant="bordered"
                          onBlur={handleBlur('numDocumento')}
                          onChange={({ currentTarget }) => {
                            setFieldValue(
                              'numDocumento',
                              currentTarget.value.replace(/[^0-9]/g, '')
                            );
                          }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5 pt-3">
                      <div>
                        <Autocomplete
                          className="dark:text-white"
                          classNames={{
                            base: 'font-semibold text-gray-500 text-sm',
                          }}
                          errorMessage={errors.departamento}
                          isInvalid={!!errors.departamento && !!touched.departamento}
                          label="Departamento"
                          labelPlacement="outside"
                          placeholder={'Selecciona el departamento'}
                          selectedKey={values.departamento}
                          variant="bordered"
                          onBlur={handleBlur('departamento')}
                          onSelectionChange={(key) => {
                            if (key) {
                              const depSelected = cat_012_departamento.find(
                                (dep) => dep.codigo === key
                              ) as Departamento;

                              setSelectedCodeDep(depSelected.codigo);
                              handleChange('departamento')(depSelected.codigo);
                              handleChange('nombreDepartamento')(depSelected.valores);

                              if (key === customer?.direccion.departamento) {
                                setFieldValue('municipio', customer?.direccion.municipio);
                                setFieldValue(
                                  'nombreMunicipio',
                                  customer?.direccion.nombreMunicipio
                                );
                              } else {
                                setFieldValue('municipio', cat_013_municipios[0].codigo);
                                setFieldValue('nombreMunicipio', cat_013_municipios[0].valores);
                              }
                            }
                          }}
                        >
                          {cat_012_departamento.map((dep) => (
                            <AutocompleteItem
                              key={dep.codigo}
                              className="dark:text-white"
                            >
                              {dep.valores}
                            </AutocompleteItem>
                          ))}
                        </Autocomplete>
                      </div>
                      <div>
                        <Autocomplete
                          className="dark:text-white"
                          classNames={{
                            base: 'font-semibold text-gray-500 text-sm',
                          }}
                          defaultSelectedKey={customer?.direccion?.municipio}
                          errorMessage={errors.municipio}
                          isInvalid={!!errors.municipio && !!touched.municipio}
                          label="Municipio"
                          labelPlacement="outside"
                          placeholder={'Selecciona el municipio'}
                          value={values.municipio}
                          variant="bordered"
                          onBlur={handleBlur('municipio')}
                          onSelectionChange={(key) => {
                            if (key) {
                              const depSelected = cat_013_municipios.find(
                                (dep) => dep.codigo === key
                              ) as Municipio;

                              handleChange('municipio')(depSelected.codigo);
                              handleChange('nombreMunicipio')(depSelected.valores);
                            }
                          }}
                        >
                          {cat_013_municipios.map((dep) => (
                            <AutocompleteItem
                              key={dep.codigo}
                              className="dark:text-white"
                            >
                              {dep.valores}
                            </AutocompleteItem>
                          ))}
                        </Autocomplete>
                      </div>
                      <div>
                        <Input
                          classNames={{
                            label: 'font-semibold text-gray-500 text-sm',
                            input: 'dark:text-white',
                            base: 'font-semibold',
                          }}
                          errorMessage={errors.telefono}
                          isInvalid={!!errors.telefono && !!touched.telefono}
                          label="Teléfono"
                          labelPlacement="outside"
                          name="telefono"
                          placeholder="Ingresa el telefono"
                          type="number"
                          value={values.telefono}
                          variant="bordered"
                          onBlur={handleBlur('telefono')}
                          onChange={({ currentTarget }) => {
                            setFieldValue('telefono', currentTarget.value.replace(/[^0-9]/g, ''));
                          }}
                        />
                      </div>

                      <div>
                        <Autocomplete
                          className="dark:text-white font-semibold"
                          classNames={{
                            base: 'font-semibold text-gray-500 text-sm',
                          }}
                          defaultSelectedKey={customer?.branch?.name}
                          errorMessage={errors.branchId}
                          isInvalid={!!errors.branchId && !!touched.branchId}
                          label="Sucursal"
                          labelPlacement="outside"
                          placeholder={customer?.branch?.name ?? 'Selecciona la sucursal'}
                          value={values.branchId}
                          variant="bordered"
                          onBlur={handleBlur('branchId')}
                          onSelectionChange={(key) => {
                            if (key) {
                              handleChange('branchId')(key as string);
                            }
                          }}
                        >
                          {branch_list.map((bra) => (
                            <AutocompleteItem
                              key={bra.id.toString()}
                              className="dark:text-white"
                            >
                              {bra.name}
                            </AutocompleteItem>
                          ))}
                        </Autocomplete>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Textarea
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                          input: 'dark:text-white',
                          base: 'font-semibold',
                        }}
                        errorMessage={errors.complemento}
                        isInvalid={!!errors.complemento && !!touched.complemento}
                        label="Complemento de dirección"
                        labelPlacement="outside"
                        name="complemento"
                        placeholder="Ingresa el complemento de dirección"
                        value={values.complemento}
                        variant="bordered"
                        onBlur={handleBlur('complemento')}
                        onChange={handleChange('complemento')}
                      />
                    </div>
                  </div>
                  <div className="w-full flex justify-end mt-5">
                    <div className="pt-4 w-full flex justify-end">
                      {isClicked ? (
                        <div className="mt-4 flex justify-center items-center">
                          <Loader className="animate-spin dark:text-white" size={35} />
                        </div>
                      ) : (
                        <ButtonUi
                          ref={button}
                          className="w-full md:w-96 font-semibold"
                          theme={Colors.Primary}
                          onClick={async (e) => {
                            e.preventDefault();
                            const valid = await validateForm().then((error) => {
                              return !error;
                            });

                            if (valid) {
                              setIsClicked(true);
                            }
                            handleSubmit();
                          }}
                        >
                          Guardar
                        </ButtonUi>
                      )}
                    </div>
                  </div>
                </>
              )}
            </Formik>
          )}
        </div>
      ) : (
        <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
          <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent flex justify-center items-center">
            <p className="text-lg font-semibold dark:text-white">
              No tiene permisos para ver este modulo
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AddClientNormal;
