import { ArrowLeft } from 'lucide-react';
import { FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';

import { useBranchesStore } from '@/store/branches.store';
import { useCategoriesStore } from '@/store/categories.store';
import { Product, ProductPayloadForm } from '@/types/products.types';
import GeneralProductInfo from '@/components/add-product/general-product-info';
import BranchProductInfo from '@/components/add-product/branch-product-info';
import MenuProductInfo from '@/components/add-product/menu-product-info';
import { initialValues, validationSchema } from '@/components/add-product/validation-add-product';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { API_URL } from '@/utils/constants';


type ProductOrder = Product & {
  quantity: number;
  uniMedidaExtra: string;
  // MOP: number;
  // CIF: number;
};

type ProductOrderReceipt = Product & {
  quantity: number;
  performanceQuantity: string;
  cost: number;
  MOP: number;
  CIF: number;
};

function AddProduct() {
  const { getBranchesList } = useBranchesStore();
  const { getListCategories } = useCategoriesStore();

  const [selectedProducts, setSelectedProducts] = useState<ProductOrder[]>([]);
  const [selectedProductsReceipt, setSelectedProductsReceipt] = useState<ProductOrderReceipt[]>([]);
  const [performance, setPerformance] = useState<string>('1');

  const [cif, setCif] = useState<number>(0);
  const [mop, setMop] = useState<number>(0);

  useEffect(() => {
    getBranchesList();
    getListCategories();
  }, []);

  const navigate = useNavigate();

  const formik = useFormik<ProductPayloadForm>({
    initialValues,
    validationSchema,
    onSubmit(values) {
      const valuesToSend = {
        ...values,
        performance: Number(performance ?? '1'),
        MOP: mop,
        CIF: cif,

        receipt: selectedProductsReceipt.map((product) => ({
          productId: product.id,
          quantity: product.performanceQuantity,
          performanceQuantity: product.quantity,
        })),
        products: selectedProducts.map((product) => ({
          productId: product.id,
          quantity: product.quantity,
          uniMedidaExtra: product.uniMedidaExtra,
        })),
      };

      axios
        .post(API_URL + '/branch-products', valuesToSend)
        .then(() => {
          toast.success('Producto creado con éxito');
          navigate('/products');
        })
        .catch(() => {
          toast.error('Error al crear el producto');
        });
    },
  });

  return (
    <>
     <Helmet>
            <title>Nuevo producto</title>
          </Helmet>
      <div className="w-full h-full p-5">
        <button
          className="flex items-center gap-2 bg-transparent"
          onClick={() => navigate('/products')}
        >
          <ArrowLeft className=" dark:text-white" />
          <span className="dark:text-white">Regresar</span>
        </button>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
        >
          <FormikProvider value={formik}>
            <GeneralProductInfo
              cif={cif}
              mop={mop}
              performance={performance}
              selectedProducts={selectedProductsReceipt}
              setCif={setCif}
              setMop={setMop}
              setPerformance={setPerformance}
              setSelectedProducts={setSelectedProductsReceipt}
            />
            <BranchProductInfo />
            <MenuProductInfo
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
            />
            <div className="w-full flex justify-end py-6 gap-5">
              <ButtonUi className="px-10" theme={Colors.Default} onPress={() => navigate(-1)}>
                Cancelar
              </ButtonUi>
              <ButtonUi className="px-10" theme={Colors.Primary} type="submit">
                Guardar
              </ButtonUi>
            </div>
          </FormikProvider>
        </form>
      </div>
    </>
  );
}

export default AddProduct;
