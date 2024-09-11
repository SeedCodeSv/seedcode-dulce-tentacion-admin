import { Button, Input, Textarea } from '@nextui-org/react';
import { global_styles } from '../../styles/global.styles';
import * as yup from 'yup';
import { Formik } from 'formik';
import { Branches, IBranchForm } from '../../types/branches.types';
import { useBranchesStore } from '../../store/branches.store';
import { useAuthStore } from '../../store/auth.store';
import { useState } from 'react';

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
  });

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
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
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
