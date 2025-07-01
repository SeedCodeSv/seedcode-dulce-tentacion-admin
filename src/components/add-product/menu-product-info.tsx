import { Checkbox, Input, Switch } from '@heroui/react';
import { useFormikContext } from 'formik';
import { useState } from 'react';

import MenuDetailsProductInfo from './menu-details-product.info';

import { Product, ProductPayloadForm } from '@/types/products.types';

type ProductOrder = Product & { quantity: number; uniMedidaExtra: string  };

interface Props {
  selectedProducts: ProductOrder[];
  setSelectedProducts: (products: ProductOrder[]) => void;
}

function MenuProductInfo({ selectedProducts, setSelectedProducts }: Props) {
  const [hasInMenu, setHasInMenu] = useState(false);
  const formik = useFormikContext<ProductPayloadForm>();

  return (
    <>
      <div className="w-full border shadow rounded-[12px] p-5 mt-3">
        <Checkbox
          checked={formik.values.menu.addToMenu}
          defaultChecked={formik.values.menu.addToMenu}
          isSelected={formik.values.menu.addToMenu}
          size="lg"
          onValueChange={(val) => {
            if (val === false) {
              setHasInMenu(false);
              formik.setFieldValue('menu.addToMenu', false);
            } else {
              setHasInMenu(true);
              formik.setFieldValue('menu.addToMenu', true);
            }
          }}
        >
          <span className="dark:text-white font-semibold">Agregar al menu</span>
        </Checkbox>
        {hasInMenu && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 gap-y-3 mt-4">
            <div className="flex flex-col col-span-1 md:col-span-2 lg:col-span-3">
              <p className="font-semibold dark:text-white py-3">Dias de la semana</p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <Checkbox
                  isSelected={formik.values.menu.mon}
                  onValueChange={(val) => formik.setFieldValue('menu.mon', val)}
                >
                  <span className="font-semibold text-sm">Lunes</span>
                </Checkbox>
                <Checkbox
                  isSelected={formik.values.menu.tue}
                  onValueChange={(val) => formik.setFieldValue('menu.tue', val)}
                >
                  <span className="font-semibold text-sm">Martes</span>
                </Checkbox>
                <Checkbox
                  isSelected={formik.values.menu.wed}
                  onValueChange={(val) => formik.setFieldValue('menu.wed', val)}
                >
                  <span className="font-semibold text-sm">Miércoles</span>
                </Checkbox>
                <Checkbox
                  isSelected={formik.values.menu.thu}
                  onValueChange={(val) => formik.setFieldValue('menu.thu', val)}
                >
                  <span className="font-semibold text-sm">Jueves</span>
                </Checkbox>
                <Checkbox
                  isSelected={formik.values.menu.fri}
                  onValueChange={(val) => formik.setFieldValue('menu.fri', val)}
                >
                  <span className="font-semibold text-sm">Viernes</span>
                </Checkbox>
                <Checkbox
                  isSelected={formik.values.menu.sat}
                  onValueChange={(val) => formik.setFieldValue('menu.sat', val)}
                >
                  <span className="font-semibold text-sm">Sábado</span>
                </Checkbox>
                <Checkbox
                  isSelected={formik.values.menu.sun}
                  onValueChange={(val) => formik.setFieldValue('menu.sun', val)}
                >
                  <span className="font-semibold text-sm">Domingo</span>
                </Checkbox>
              </div>
            </div>
            <div className="py-4">
              <Switch
                isSelected={formik.values.menu.noDeadline}
                onValueChange={(val) => formik.setFieldValue('menu.noDeadline', val)}
              >
                <span className="font-semibold">
                  {formik.values.menu.noDeadline ? 'Desactivar' : 'Activar'} fecha de vigencia
                </span>
              </Switch>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 col-span-1 md:col-span-2 lg:col-span-3">
              <Input
                className='dark:text-white'
                classNames={{ label: 'font-semibold' }}
                disabled={!formik.values.menu.noDeadline}
                label="Fecha inicio de vigencia"
                labelPlacement="outside"
                type="date"
                variant="bordered"
                {...formik.getFieldProps('menu.deDate')}
                errorMessage={formik.errors.menu?.deDate}
                isInvalid={!!formik.errors.menu?.deDate && formik.touched.menu?.deDate}
              />
              <Input
               className='dark:text-white'
                classNames={{ label: 'font-semibold' }}
                disabled={!formik.values.menu.noDeadline}
                label="Fecha fin de vigencia"
                labelPlacement="outside"
                type="date"
                variant="bordered"
                {...formik.getFieldProps('menu.alDate')}
                errorMessage={formik.errors.menu?.alDate}
                isInvalid={!!formik.errors.menu?.alDate && formik.touched.menu?.alDate}
              />
              <Input
               className='dark:text-white'
                classNames={{ label: 'font-semibold' }}
                disabled={!formik.values.menu.noDeadline}
                label="Hora inicio de vigencia"
                labelPlacement="outside"
                type="time"
                variant="bordered"
                {...formik.getFieldProps('menu.deTime')}
                errorMessage={formik.errors.menu?.deTime}
                isInvalid={!!formik.errors.menu?.deTime && formik.touched.menu?.deTime}
              />
              <Input
               className='dark:text-white'
                classNames={{ label: 'font-semibold' }}
                disabled={!formik.values.menu.noDeadline}
                label="Hora fin de vigencia"
                labelPlacement="outside"
                type="time"
                variant="bordered"
                {...formik.getFieldProps('menu.alTime')}
                errorMessage={formik.errors.menu?.alTime}
                isInvalid={!!formik.errors.menu?.alTime && formik.touched.menu?.alTime}
              />
            </div>
          </div>
        )}
      </div>
      {hasInMenu && <MenuDetailsProductInfo selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} />}
    </>
  );
}

export default MenuProductInfo;
