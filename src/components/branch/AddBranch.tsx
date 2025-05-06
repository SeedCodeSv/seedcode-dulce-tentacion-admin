import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import * as yup from 'yup';
import { Formik } from 'formik';
import { useState } from 'react';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';

import { global_styles } from '../../styles/global.styles';
import { Branches, IBranchForm } from '../../types/branches.types';
import { useBranchesStore } from '../../store/branches.store';
import { useAuthStore } from '../../store/auth.store';


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
              user?.pointOfSale?.branch.transmitterId ??
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
            user?.pointOfSale?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0,
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
                  className="dark:text-white font-semibold"
                  classNames={{ base: 'font-semibold text-gray-500 text-sm' }}
                  errorMessage={touched.name && errors.name}
                  isInvalid={touched.name && !!errors.name}
                  label="Nombre"
                  labelPlacement="outside"
                  placeholder="Nombre de la sucursal"
                  value={values.name}
                  variant="bordered"
                  onBlur={handleBlur('name')}
                  onChange={handleChange('name')}
                />
                {/* {errors.name && touched.name && (
                <span className="text-sm font-semibold text-red-500">{errors.name}</span>
              )} */}
              </div>
              <div className="w-full pt-3">
                <Input
                  className="dark:text-white font-semibold"
                  classNames={{ base: 'font-semibold text-gray-500 text-sm' }}
                  errorMessage={touched.phone && errors.phone}
                  isInvalid={touched.phone && !!errors.phone}
                  label="Teléfono"
                  labelPlacement="outside"
                  placeholder="Teléfono de la sucursal"
                  type="number"
                  value={values.phone}
                  variant="bordered"
                  onBlur={handleBlur('phone')}
                  onChange={handleChange('phone')}
                />
                {/* {errors.phone && touched.phone && (
                  <span className="text-sm font-semibold text-red-500">{errors.phone}</span>
                )} */}
              </div>

              <div className="w-full pt-3">
                <Select
                  classNames={{ label: 'font-semibold text-sm', base: 'font-semibold' }}
                  errorMessage={errors.tipoEstablecimiento}
                  isInvalid={touched.tipoEstablecimiento && !!errors.tipoEstablecimiento}
                  label="Tipo de establecimiento"
                  labelPlacement="outside"
                  placeholder={type?.valores ? type.valores : 'Tipo de establecimiento'}
                  value={values.tipoEstablecimiento}
                  variant="bordered"
                  onBlur={handleBlur('tipoEstablecimiento')}
                  onChange={handleChange('tipoEstablecimiento')}
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
                  classNames={{ label: 'font-semibold text-sm', base: 'font-semibold' }}
                  errorMessage={errors.codEstable}
                  isInvalid={touched.codEstable && !!errors.codEstable}
                  label="Codigo de establecimiento"
                  labelPlacement="outside"
                  placeholder="Codigo de establecimiento"
                  value={values.codEstable}
                  variant="bordered"
                  onBlur={handleBlur('codEstable')}
                  onChange={(e) => {
                    handleChange('codEstable')(e);
                    setFieldValue('codEstableMH', e.target.value);
                  }}
                />
              </div>
              <div className="w-full pt-3">
                <Input
                  // type="number"
                  readOnly
                  classNames={{ label: 'font-semibold text-sm', base: 'font-semibold' }}
                  errorMessage={errors.codEstableMH}
                  isInvalid={touched.codEstableMH && !!errors.codEstableMH}
                  label="Codigo de establecimiento MH"
                  labelPlacement="outside"
                  placeholder="Codigo establecimiento MH"
                  value={values.codEstableMH}
                  variant="bordered"
                />
              </div>
              <div className="w-full pt-3">
                <Textarea
                  className="dark:text-white font-semibold"
                  classNames={{ base: 'font-semibold text-gray-500 text-sm' }}
                  errorMessage={touched.address && errors.address}
                  isInvalid={touched.address && !!errors.address}
                  label="Dirección"
                  labelPlacement="outside"
                  placeholder="Dirección de la sucursal"
                  value={values.address}
                  variant="bordered"
                  onBlur={handleBlur('address')}
                  onChange={handleChange('address')}
                />
                {/* {errors.address && touched.address && (
                  <span className="text-sm font-semibold text-red-500">{errors.address}</span>
                )} */}
              </div>
              <div className="mt-4">
                {!isSubmitting ? (
                  <Button
                    className="w-full font-semibold"
                    style={global_styles().thirdStyle}
                    type="submit"
                    onClick={() => handleSubmit()}
                  >
                    {props.branch ? 'Guardar cambios' : 'Crear sucursal'}
                  </Button>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full">
                    <div className="loaderBranch w-2 h-2 mt-2" />
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
