import { Autocomplete, AutocompleteItem, Input } from "@heroui/react";
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Formik, Form } from 'formik';

import { validation_correlatives } from './types/validation_correlatives_yup';

import { IPropsCorrelativeUpdate } from '@/types/correlatives/correlatives_types';
import { correlativesTypes } from '@/types/correlatives/correlatives_data.types';
import { useCorrelativesStore } from '@/store/correlatives-store/correlatives.store';
import { useBranchesStore } from '@/store/branches.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
function CreateCorrelative({ onClose, reload }: IPropsCorrelativeUpdate) {

  const { OnCreateCorrelatives } = useCorrelativesStore();

  const { getBranchesList, branch_list } = useBranchesStore();

  useEffect(() => {
    getBranchesList();
  }, []);

  return (
    <Formik
      initialValues={{
        code: '',
        typeVoucher: '',
        resolution: '',
        from: '',
        to: '',
        next: 0,
        prev: 0,
        serie: '',
        branchId: '',
      }}
      validationSchema={validation_correlatives}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await OnCreateCorrelatives(values).then(() => {
            toast.success('Se creo el correlativo');
            onClose();
            reload();
          });
        } catch (error) {
          return;
        }
        setSubmitting(false);
      }}
    >
      {({ errors, touched, values, handleChange, handleBlur, setFieldValue }) => (
        <Form className="dark:text-white ">
          <div className="mt-5 grid grid-cols-2 gap-5 ">
            <div className="pt-2">
              <Input
                classNames={{
                  label: 'text-gray-500 text-sm',
                }}
                label="Código"
                labelPlacement="outside"
                name="code"
                placeholder="Código"
                value={values.code}
                variant="bordered"
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.code && touched.code && (
                <span className="text-sm font-semibold text-red-500">{errors.code}</span>
              )}{' '}
            </div>
            <div className="pt-2">
              <Autocomplete
                className="dark:text-white"
                classNames={{
                  base: 'text-gray-500 text-sm',
                }}
                label="Tipo de Factura"
                labelPlacement="outside"
                placeholder="Selecciona el Tipo de Factura"
                variant="bordered"
                onSelectionChange={(e) => {
                  const selectCorrelativeType = correlativesTypes.find(
                    (dep) => dep.value === new Set([e]).values().next().value
                  );

                  if (selectCorrelativeType) {
                    setFieldValue('typeVoucher', selectCorrelativeType.value);
                  }
                }}
              >
                {correlativesTypes.map((dep) => (
                  <AutocompleteItem key={dep.value} className="dark:text-white">
                    {dep.value + ' - ' + dep.label}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
              {errors.typeVoucher && touched.typeVoucher && (
                <span className="text-sm font-semibold text-red-500">{errors.typeVoucher}</span>
              )}{' '}
            </div>
            <div className="pt-2">
              <Input
                classNames={{
                  label: 'text-gray-500 text-sm',
                }}
                label="Resolución"
                labelPlacement="outside"
                name="resolution"
                placeholder="Ingresa la resolución"
                value={values.resolution}
                variant="bordered"
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.resolution && touched.resolution && (
                <span className="text-sm font-semibold text-red-500">{errors.resolution}</span>
              )}{' '}
            </div>
            <div className="pt-2">
              <Input
                classNames={{
                  label: 'text-gray-500 text-sm',
                }}
                label="Serie"
                labelPlacement="outside"
                name="serie"
                placeholder="Ingresa la serie"
                value={values.serie}
                variant="bordered"
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.serie && touched.serie && (
                <span className="text-sm font-semibold text-red-500">{errors.serie}</span>
              )}{' '}
            </div>
            <div className="pt-2">
              <Input
                classNames={{
                  label: 'text-gray-500 text-sm',
                }}
                label="Inicio"
                labelPlacement="outside"
                name="from"
                placeholder="Ingresa el inicio"
                value={values.from}
                variant="bordered"
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.from && touched.from && (
                <span className="text-sm font-semibold text-red-500">{errors.from}</span>
              )}{' '}
            </div>
            <div className="pt-2">
              <Input
                classNames={{
                  label: 'text-gray-500 text-sm',
                }}
                label="Fin"
                labelPlacement="outside"
                name="to"
                placeholder="Ingresa el fin"
                value={values.to}
                variant="bordered"
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.to && touched.to && (
                <span className="text-sm font-semibold text-red-500">{errors.to}</span>
              )}{' '}
            </div>
            <div className="pt-2">
              <Input
                classNames={{
                  label: 'text-gray-500 text-sm',
                }}
                label="Anterior"
                labelPlacement="outside"
                name="prev"
                placeholder="Ingresa el anterior"
                type="number"
                value={values.prev.toString()}
                variant="bordered"
                onChange={handleChange}
              />
              {errors.prev && touched.prev && (
                <span className="text-sm font-semibold text-red-500">{errors.prev}</span>
              )}{' '}
            </div>
            <div className="pt-2">
              <Input
                classNames={{
                  label: 'text-gray-500 text-sm',
                }}
                label="Siguiente"
                labelPlacement="outside"
                name="next"
                placeholder="Ingresa el siguiente"
                value={values.next.toString()}
                variant="bordered"
                onChange={handleChange}
              />
              {errors.next && touched.next && (
                <span className="text-sm font-semibold text-red-500">{errors.next}</span>
              )}{' '}
            </div>
          </div>
          <div className="pt-2">
            <Autocomplete
              className="dark:text-white"
              classNames={{
                base: 'font-semibold text-sm',
              }}
              label="Sucursal"
              labelPlacement="outside"
              name="branchId"
              placeholder="Selecciona la sucursal"
              value={values.branchId}
              variant="bordered"
              onSelectionChange={(selectedBranch) => {
                const selectedBranchId = new Set([selectedBranch]).values().next().value;

                setFieldValue('branchId', selectedBranchId);
              }}
            >
              {branch_list.map((bra) => (
                <AutocompleteItem key={bra.id} className="dark:text-white">
                  {bra.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            {errors.branchId && touched.branchId && (
              <span className="text-sm font-semibold text-red-500">{errors.branchId}</span>
            )}
          </div>
          <div className="w-full">
            <ButtonUi
              className="w-full mt-4 text-sm font-semibold"
              theme={Colors.Primary}
              type="submit"
            >
              Guardar
            </ButtonUi>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default CreateCorrelative;
