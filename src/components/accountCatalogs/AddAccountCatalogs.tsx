import {
    Input,
    Button,
    Select,
    SelectItem,
} from '@nextui-org/react';
import Layout from '@/layout/Layout';
import useGlobalStyles from '../global/global.styles';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { AccountCatalogPayload } from '@/types/accountCatalogs.types';
import { API_URL } from '@/utils/constants';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

function AddAccountCatalogs() {
    const styles = useGlobalStyles();
    const navigate = useNavigate();


    const AccountTypes = [
        { key: "Rubro", value: "Rubro", label: "Interna" },
        { key: "Mayor", value: "Mayor", label: "Internación" },
        { key: "SubCuenta", value: "SubCuenta", label: "Importación" },
    ];


    const formik = useFormik({
        initialValues: {
            code: "",
            name: "",
            majorAccount: "",
            level: "",
            hasSub: false,
            type: "Rubro",
        },
        validationSchema: yup.object().shape({
            code: yup.string().required("**Campo requerido**"),
            name: yup.string().required("**Campo requerido**"),
            majorAccount: yup.string().required("**Campo requerido**"),
            level: yup.string().required("**Campo requerido**"),
            hasSub: yup.boolean().required("**Campo requerido**"),

        }),
        async onSubmit(values, formikHelpers) {

            try {
                const payload: AccountCatalogPayload = {
                    ...values
                }
                axios
                    .post(API_URL + "/account-catalogs", payload)
                    .then(() => {
                        toast.success("Catalogo de cuentas guardada con éxito")
                        formikHelpers.setSubmitting(false)
                        navigate("/shopping")
                    })
                    .catch(() => {
                        toast.error("Error al guardar la compra")
                        formikHelpers.setSubmitting(false)
                    })
            } catch (error) {
                toast.error("Error al guardar la compra")

            }
        }
    })

    return (
        <Layout title='Catalogo de cuentas'>
            <>
                <div className="">
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        formik.submitForm()
                    }}>
                        <>
                            <div className="w-full">
                                <div className="grid w-full grid-cols-1 gap-5 mt-2 md:grid-cols-2">
                                    <div className="pt-5 pb-2">

                                        <Input
                                            classNames={{ label: "font-semibold" }}
                                            label="Codigo"
                                            placeholder="Ingrese el codigo"
                                            variant="bordered"
                                            value={formik.values.code}
                                            name='code'
                                            onChange={formik.handleChange("code")}
                                            onBlur={formik.handleBlur("code")}
                                            labelPlacement="outside"
                                            isInvalid={!!formik.touched.code && !!formik.errors.code}
                                            errorMessage={formik.errors.code}
                                        />

                                        <Input
                                            classNames={{ label: "font-semibold" }}
                                            label="Nombre"
                                            placeholder="Ingrese el nombre"
                                            variant="bordered"
                                            value={formik.values.name}
                                            name='name'
                                            onChange={formik.handleChange("name")}
                                            onBlur={formik.handleBlur("name")}
                                            labelPlacement="outside"
                                            isInvalid={!!formik.touched.name && !!formik.errors.name}
                                            errorMessage={formik.errors.name}
                                        />

                                        <Input
                                            label="Mejor Cuenta"
                                            labelPlacement="outside"
                                            name="majorAccount"
                                            value={formik.values.majorAccount}
                                            onChange={formik.handleChange('majorAccount')}
                                            onBlur={formik.handleBlur('majorAccount')}
                                            placeholder="00.00"
                                            classNames={{ label: "font-semibold" }}
                                            variant="bordered"
                                            isInvalid={!!formik.touched.majorAccount && !!formik.errors.majorAccount}
                                            errorMessage={formik.errors.majorAccount}
                                        />



                                        <Input
                                            label="Nivel"
                                            labelPlacement="outside"
                                            name="level"
                                            value={formik.values.level}
                                            onChange={formik.handleChange('level')}
                                            onBlur={formik.handleBlur('level')}
                                            placeholder="00.00"
                                            classNames={{ label: "font-semibold" }}
                                            variant="bordered"
                                            isInvalid={!!formik.touched.level && !!formik.errors.level}
                                            errorMessage={formik.errors.level}
                                        />
                                        <Input
                                            label="Sub Cuenta"
                                            labelPlacement="outside"
                                            name="hasSub"
                                            value={formik.values.hasSub.toString()}
                                            onChange={formik.handleChange('hasSub')}
                                            onBlur={formik.handleBlur('hasSub')}
                                            placeholder="00.00"
                                            classNames={{ label: "font-semibold" }}
                                            variant="bordered"
                                            isInvalid={!!formik.touched.hasSub && !!formik.errors.hasSub}
                                            errorMessage={formik.errors.hasSub}
                                        />


                                        {/* <Select
                                            classNames={{ label: "font-semibold" }}
                                            variant="bordered"
                                            label="Tipo de cuenta"
                                            placeholder="Selecciona el tipo"
                                            labelPlacement="outside"
                                            defaultSelectedKeys={[`${formik.values.type}`]}
                                            onSelectionChange={(key) => {
                                                const value = new Set(key).values().next().value
                                                key ? formik.setFieldValue("type", value) : formik.setFieldValue("typeSale", "")
                                            }}
                                            onBlur={formik.handleBlur("type")}
                                            isInvalid={!!formik.touched.type && !!formik.errors.type}
                                            errorMessage={formik.errors.type}
                                        >
                                            <SelectItem key={"Rubro"} value="Rubro">
                                                Interna
                                            </SelectItem>
                                            <SelectItem key={"Mayor"} value="Mayor">
                                                Internación
                                            </SelectItem>
                                            <SelectItem key={"SubCuenta"} value="SubCuenta">
                                                Importación
                                            </SelectItem>
                                        </Select> */}




                                        <Select
                                            classNames={{ label: "font-semibold" }}
                                            variant="bordered"
                                            label="Tipo de cuenta"
                                            placeholder="Selecciona el tipo"
                                            labelPlacement="outside"
                                            defaultSelectedKeys={[`${formik.values.type}`]}
                                            onSelectionChange={(key) => {
                                                const value = new Set(key).values().next().value
                                                key ? formik.setFieldValue("type", value) : formik.setFieldValue("typeSale", "")
                                            }}
                                            onBlur={formik.handleBlur("type")}
                                            isInvalid={!!formik.touched.type && !!formik.errors.type}
                                            errorMessage={formik.errors.type}
                                        >
                                            {AccountTypes.map((type) => (
                                                <SelectItem key={type.key} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </Select>


                                    </div>
                                </div>
                                <div className="w-full flex justify-end mt-4">
                                    <Button type="submit" className="px-16" style={styles.thirdStyle}>
                                        Guardar
                                    </Button>
                                </div>
                            </div>
                        </>
                    </form>
                </div>
            </>
        </Layout>
    );
}

export default AddAccountCatalogs;
