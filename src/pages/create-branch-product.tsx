import { ArrowLeft } from 'lucide-react';
import { FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { toast } from 'sonner';

import Layout from '@/layout/Layout';
import { useBranchesStore } from '@/store/branches.store';
import { useCategoriesStore } from '@/store/categories.store';
import { Product, ProductPayloadFormTwo } from '@/types/products.types';
import BranchProductInfo from '@/components/add-product/branch-product-info';
import MenuProductInfo from '@/components/add-product/menu-product-info';
import { initialValues } from '@/components/add-product/validation-add-product';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { API_URL } from '@/utils/constants';

type ProductOrder = Product & { quantity: number; uniMedidaExtra: string };

function AddBranchProduct() {
    const { id } = useParams<{ id: string }>();
    const { getBranchesList } = useBranchesStore();
    const { getListCategories } = useCategoriesStore();

    const [selectedProducts, setSelectedProducts] = useState<ProductOrder[]>([]);

    useEffect(() => {
        getBranchesList();
        getListCategories();
    }, []);

    const navigate = useNavigate();

    const formik = useFormik<ProductPayloadFormTwo>({
        initialValues,

        onSubmit(values) {
            const valuesToSend = {
                ...values,
                products: [],
                receipt: []
            };

            axios.post(API_URL + '/branch-products/' + id!, valuesToSend).then(() => {
                toast.success('Se guardo con exito')
                navigate('/products')
                window.location.reload()

            }).catch(() => {
                toast.error('No se guardaron los datos')
            })
        },
    });

    return (
        <Layout title="Nuevo producto">
            <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-900">
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
                    
                        <BranchProductInfo />
                        <MenuProductInfo
                            selectedProducts={selectedProducts}
                            setSelectedProducts={setSelectedProducts}
                        />
                        <div className="w-full flex justify-end py-6 gap-5">
                            <ButtonUi className="px-10" theme={Colors.Default}>
                                Cancelar
                            </ButtonUi>
                            <ButtonUi className="px-10" theme={Colors.Primary} type="submit">
                                Guardar
                            </ButtonUi>
                        </div>
                    </FormikProvider>
                </form>
            </div>
        </Layout>
    );
}

export default AddBranchProduct;
