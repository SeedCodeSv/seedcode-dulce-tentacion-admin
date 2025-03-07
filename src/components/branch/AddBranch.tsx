import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { global_styles } from '../../styles/global.styles';
import * as yup from 'yup';
import { Formik } from 'formik';
import { Branches, IBranchForm } from '../../types/branches.types';
import { useBranchesStore } from '../../store/branches.store';
import { useAuthStore } from '../../store/auth.store';
import { useState } from 'react';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';

interface Props {
  closeModal: () => void;
  branch?: Branches | undefined;
}

function AddBranch(props: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = yup.object().shape({
    name: yup.string().required('** El nombre es requerido **'),
    address: yup.string().required('** La dirección es requerida **'),
    phone: yup.string().required('** El teléfono es requerido **'),
    codEstable: yup.string().required('**El Código de establecimiento es requerido**'),
    codEstableMH: yup.string().required('**El Código de establecimiento MH es requerido**'),
    tipoEstablecimiento: yup.string().required('**El tipo de establecimiento es requerido**'),
  });

  const type_estable = new SeedcodeCatalogosMhService().get009TipoDeEstablecimiento();
  const type = type_estable.find((item) => item.codigo === props.branch?.tipoEstablecimiento);

  const { user } = useAuthStore();

  const { postBranch, patchBranch } = useBranchesStore();

  const handleSubmit = async (values: IBranchForm) => {
    setIsSubmitting(true);
    try {
      if (props.branch) {
        const res = await patchBranch(
          {
            ...values,
            transmitterId:
              user?.correlative?.branch.transmitterId ??
              user?.pointOfSale?.branch.transmitterId ??
              0,
          },
          props.branch.id
        );
        if (res) props.closeModal();
      } else {
        const res = await postBranch({
          ...values,
          transmitterId:
            user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0,
        });
        if (res) props.closeModal();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-4 dark:text-white">
      <Formik
        initialValues={{
          name: props.branch?.name ?? '',
          address: props.branch?.address ?? '',
          phone: props.branch?.phone ?? '',
          codEstable: props.branch?.codEstable ?? '',
          codEstableMH: props.branch?.codEstableMH ?? '',
          tipoEstablecimiento: props.branch?.tipoEstablecimiento ?? '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleBlur, setFieldValue, handleChange, handleSubmit }) => (
          <>
            <div className="w-full">
              <div className="w-full pt-3">
                <Input
                  label="Nombre"
                  className="dark:text-white font-semibold"
                  placeholder="Nombre de la sucursal"
                  variant="bordered"
                  onChange={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  classNames={{ base: 'font-semibold text-gray-500 text-sm' }}
                  labelPlacement="outside"
                  isInvalid={touched.name && !!errors.name}
                  errorMessage={touched.name && errors.name}
                />
                {/* {errors.name && touched.name && (
                <span className="text-sm font-semibold text-red-500">{errors.name}</span>
              )} */}
              </div>
              <div className="w-full pt-3">
                <Input
                  type="number"
                  label="Teléfono"
                  className="dark:text-white font-semibold"
                  placeholder="Teléfono de la sucursal"
                  variant="bordered"
                  classNames={{ base: 'font-semibold text-gray-500 text-sm' }}
                  labelPlacement="outside"
                  onChange={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  value={values.phone}
                  isInvalid={touched.phone && !!errors.phone}
                  errorMessage={touched.phone && errors.phone}
                />
                {/* {errors.phone && touched.phone && (
                  <span className="text-sm font-semibold text-red-500">{errors.phone}</span>
                )} */}
              </div>

              <div className="w-full pt-3">
                <Select
                  label="Tipo de establecimiento"
                  placeholder={type?.valores ? type.valores : 'Tipo de establecimiento'}
                  variant="bordered"
                  classNames={{ label: 'font-semibold text-sm', base: 'font-semibold' }}
                  labelPlacement="outside"
                  onChange={handleChange('tipoEstablecimiento')}
                  onBlur={handleBlur('tipoEstablecimiento')}
                  value={values.tipoEstablecimiento}
                  isInvalid={touched.tipoEstablecimiento && !!errors.tipoEstablecimiento}
                  errorMessage={errors.tipoEstablecimiento}
                >
                  {type_estable.map((item) => (
                    <SelectItem key={item.codigo}>
                      {item.valores}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className="w-full pt-3">
                <Input
                  // type="number"
                  label="Codigo de establecimiento"
                  placeholder="Codigo de establecimiento"
                  variant="bordered"
                  classNames={{ label: 'font-semibold text-sm', base: 'font-semibold' }}
                  labelPlacement="outside"
                  onChange={(e) => {
                    handleChange('codEstable')(e);
                    setFieldValue('codEstableMH', e.target.value);
                  }}
                  onBlur={handleBlur('codEstable')}
                  value={values.codEstable}
                  isInvalid={touched.codEstable && !!errors.codEstable}
                  errorMessage={errors.codEstable}
                />
              </div>
              <div className="w-full pt-3">
                <Input
                  // type="number"
                  label="Codigo de establecimiento MH"
                  placeholder="Codigo establecimiento MH"
                  variant="bordered"
                  classNames={{ label: 'font-semibold text-sm', base: 'font-semibold' }}
                  labelPlacement="outside"
                  value={values.codEstableMH}
                  isInvalid={touched.codEstableMH && !!errors.codEstableMH}
                  errorMessage={errors.codEstableMH}
                  readOnly
                />
              </div>
              <div className="w-full pt-3">
                <Textarea
                  className="dark:text-white font-semibold"
                  label="Dirección"
                  placeholder="Dirección de la sucursal"
                  variant="bordered"
                  classNames={{ base: 'font-semibold text-gray-500 text-sm' }}
                  labelPlacement="outside"
                  onChange={handleChange('address')}
                  onBlur={handleBlur('address')}
                  value={values.address}
                  isInvalid={touched.address && !!errors.address}
                  errorMessage={touched.address && errors.address}
                />
                {/* {errors.address && touched.address && (
                  <span className="text-sm font-semibold text-red-500">{errors.address}</span>
                )} */}
              </div>
              <div className="mt-4">
                {!isSubmitting ? (
                  <Button
                    type="submit"
                    onClick={() => handleSubmit()}
                    style={global_styles().thirdStyle}
                    className="w-full font-semibold"
                  >
                    {props.branch ? 'Guardar cambios' : 'Crear sucursal'}
                  </Button>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full">
                    <div className="loaderBranch w-2 h-2 mt-2"></div>
                    <p className="mt-3 text-sm font-semibold">Cargando...</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </Formik>
    </div>
  );
}

export default AddBranch;
