import { ThemeContext } from '@/hooks/useTheme';
import { useBranchesStore } from '@/store/branches.store';
import { useCorrelativesStore } from '@/store/correlatives-store/correlatives.store';
import { correlativesTypes } from '@/types/correlatives/correlatives_data.types';
import { IPropsCorrelativeUpdate } from '@/types/correlatives/correlatives_types';
import { Autocomplete, AutocompleteItem, Button, Input } from '@nextui-org/react';
import { useContext, useEffect } from 'react';
import { toast } from 'sonner';
import { Formik, Form } from 'formik';
import { validation_correlatives } from './types/validation_correlatives_yup';
function CreateCorrelative({ onClose, reload }: IPropsCorrelativeUpdate) {
  const { theme } = useContext(ThemeContext);

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
                onChange={handleChange}
                onBlur={handleBlur}
                label="Código"
                value={values.code}
                labelPlacement="outside"
                name="code"
                placeholder="Código"
                classNames={{
                  label: 'text-gray-500 text-sm',
                }}
                variant="bordered"
              />
              {errors.code && touched.code && (
                <span className="text-sm font-semibold text-red-500">{errors.code}</span>
              )}{' '}
            </div>
            <div className="pt-2">
              <Autocomplete
                onSelectionChange={(e) => {
                  const selectCorrelativeType = correlativesTypes.find(
                    (dep) => dep.value === new Set([e]).values().next().value
                  );
                  if (selectCorrelativeType) {
                    setFieldValue('typeVoucher', selectCorrelativeType.value);
                  }
                }}
                label="Tipo de Factura"
                labelPlacement="outside"
                placeholder="Selecciona el Tipo de Factura"
                variant="bordered"
                className="dark:text-white"
                classNames={{
                  base: 'text-gray-500 text-sm',
                }}
              >
                {correlativesTypes.map((dep) => (
                  <AutocompleteItem className="dark:text-white" value={dep.label} key={dep.value}>
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
                onBlur={handleBlur}
                value={values.resolution}
                onChange={handleChange}
                label="Resolución"
                labelPlacement="outside"
                name="resolution"
                placeholder="Ingresa la resolución"
                classNames={{
                  label: 'text-gray-500 text-sm',
                }}
                variant="bordered"
              />
              {errors.resolution && touched.resolution && (
                <span className="text-sm font-semibold text-red-500">{errors.resolution}</span>
              )}{' '}
            </div>
            <div className="pt-2">
              <Input
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.serie}
                label="Serie"
                labelPlacement="outside"
                name="serie"
                placeholder="Ingresa la serie"
                classNames={{
                  label: 'text-gray-500 text-sm',
                }}
                variant="bordered"
              />
              {errors.serie && touched.serie && (
                <span className="text-sm font-semibold text-red-500">{errors.serie}</span>
              )}{' '}
            </div>
            <div className="pt-2">
              <Input
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.from}
                label="Inicio"
                labelPlacement="outside"
                name="from"
                placeholder="Ingresa el inicio"
                classNames={{
                  label: 'text-gray-500 text-sm',
                }}
                variant="bordered"
              />
              {errors.from && touched.from && (
                <span className="text-sm font-semibold text-red-500">{errors.from}</span>
              )}{' '}
            </div>
            <div className="pt-2">
              <Input
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.to}
                label="Fin"
                labelPlacement="outside"
                name="to"
                placeholder="Ingresa el fin"
                classNames={{
                  label: 'text-gray-500 text-sm',
                }}
                variant="bordered"
              />
              {errors.to && touched.to && (
                <span className="text-sm font-semibold text-red-500">{errors.to}</span>
              )}{' '}
            </div>
            <div className="pt-2">
              <Input
                onChange={handleChange}
                label="Anterior"
                value={values.prev.toString()}
                labelPlacement="outside"
                name="prev"
                placeholder="Ingresa el anterior"
                type="number"
                classNames={{
                  label: 'text-gray-500 text-sm',
                }}
                variant="bordered"
              />
              {errors.prev && touched.prev && (
                <span className="text-sm font-semibold text-red-500">{errors.prev}</span>
              )}{' '}
            </div>
            <div className="pt-2">
              <Input
                value={values.next.toString()}
                onChange={handleChange}
                label="Siguiente"
                labelPlacement="outside"
                name="next"
                placeholder="Ingresa el siguiente"
                classNames={{
                  label: 'text-gray-500 text-sm',
                }}
                variant="bordered"
              />
              {errors.next && touched.next && (
                <span className="text-sm font-semibold text-red-500">{errors.next}</span>
              )}{' '}
            </div>
          </div>
          <div className="pt-2">
            <Autocomplete
              value={values.branchId}
              onSelectionChange={(selectedBranch) => {
                const selectedBranchId = new Set([selectedBranch]).values().next().value;
                setFieldValue('branchId', selectedBranchId);
              }}
              name="branchId"
              label="Sucursal"
              labelPlacement="outside"
              placeholder="Selecciona la sucursal"
              variant="bordered"
              className="dark:text-white"
              classNames={{
                base: 'font-semibold text-sm',
              }}
            >
              {branch_list.map((bra) => (
                <AutocompleteItem className="dark:text-white" value={bra.id} key={bra.id}>
                  {bra.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            {errors.branchId && touched.branchId && (
              <span className="text-sm font-semibold text-red-500">{errors.branchId}</span>
            )}
          </div>
          <div className="w-full">
            <Button
              type="submit"
              className="w-full mt-4 text-sm font-semibold"
              style={{
                backgroundColor: theme.colors.third,
                color: theme.colors.primary,
              }}
            >
              Guardar
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default CreateCorrelative;
