import { ArrowLeft } from 'lucide-react';
import { FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import Layout from '@/layout/Layout';
import { useBranchesStore } from '@/store/branches.store';
import { useCategoriesStore } from '@/store/categories.store';
import { Product, ProductPayloadForm } from '@/types/products.types';
import GeneralProductInfo from '@/components/add-product/general-product-info';
import BranchProductInfo from '@/components/add-product/branch-product-info';
import MenuProductInfo from '@/components/add-product/menu-product-info';
import { initialValues, validationSchema } from '@/components/add-product/validation-add-product';

type ProductOrder = Product & { quantity: number; uniMedidaExtra: string };

function AddProduct() {
  const { getBranchesList } = useBranchesStore();
  const { getListCategories } = useCategoriesStore();

  const [selectedProducts, setSelectedProducts] = useState<ProductOrder[]>([]);

  useEffect(() => {
    getBranchesList();
    getListCategories();
  }, []);

  const navigate = useNavigate();

  const formik = useFormik<ProductPayloadForm>({
    initialValues,
    validationSchema,
    onSubmit() {
      // console.log(values);
    },
  });

  return (
    <Layout title="Nuevo producto">
      <div className=" w-full h-full p-5 lg:p-8 bg-gray-50 dark:bg-gray-900">
        <button
          className="flex items-center gap-2 bg-transparent"
          onClick={() => navigate('/products')}
        >
          <ArrowLeft className=" dark:text-white" />
          <span className="dark:text-white">Regresar</span>
        </button>
        <FormikProvider value={formik}>
          <GeneralProductInfo />
          <BranchProductInfo />
          <MenuProductInfo
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
          />
        </FormikProvider>
      </div>
    </Layout>
  );
}

export default AddProduct;
