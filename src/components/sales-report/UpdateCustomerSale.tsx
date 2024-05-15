import { Button, Input } from "@nextui-org/react"
import { Customer } from "../../types/report_contigence"
import { useContext, useEffect, useState } from "react"
import { useLogsStore } from "../../store/logs.store"
import { useCustomerStore } from "../../store/customers.store"
import { PayloadCustomer } from "../../types/customers.types"
import { ThemeContext } from "../../hooks/useTheme"

interface Props {
    codigoGeneracion: string,
    customer?: Customer
}
const UpdateCustomerSales = (props: Props) => {
    const { theme } = useContext(ThemeContext);

    const { patchCustomer } = useCustomerStore()
    const { logs, getLogs } = useLogsStore()
    useEffect(() => {
        if (props.codigoGeneracion) {
            getLogs(props.codigoGeneracion)
        }
    }, [props.customer])
    const [dataUpdateCustomer, setDataUpdateCustomer] = useState<PayloadCustomer>()
    const UpdateCustomer = () => {
        if (dataUpdateCustomer) {
            patchCustomer(dataUpdateCustomer, props.customer?.id || 0);
        }
    };

    return (
        <>
            <div>
                {logs.map((log) => (
                    <p> {log.message}</p>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-3 p-3  ">
                <div className="mt-5">
                    <Input
                        label="Nombre de cliente"
                        labelPlacement="outside"
                        size="lg"

                        defaultValue={props.customer?.nombre}
                        value={props.customer?.nombre}
                        placeholder="Ingresa el nombre de cliente"
                        classNames={{
                            label: "text-gray-500 text-base",
                        }}
                        variant="bordered" />
                </div>
                <div className="mt-5">
                    <Input
                        label="Nombre Comercial"
                        labelPlacement="outside"
                        size="lg"
                        defaultValue={props.customer?.nombreComercial}
                        placeholder="Ingresa el nombre comercial"
                        type="text"
                        classNames={{
                            label: "text-gray-500 text-base",
                        }}
                        variant="bordered" />
                </div>
                <div className="pt-2">
                    <Input
                        label="Correo"
                        labelPlacement="outside"
                        size="lg"
                        defaultValue={props.customer?.correo}
                        placeholder="Ingrese el correo"
                        type="text"
                        classNames={{
                            label: "text-gray-500 text-base",
                        }}
                        variant="bordered" />
                </div>
                <div className="pt-2">
                    <Input
                        label="Direccion"
                        defaultValue={props.customer?.direccion.nombreDepartamento + " " + String(props.customer?.direccion.nombreMunicipio) + " " + String(props.customer?.direccion.complemento)}
                        labelPlacement="outside"
                        size="lg"
                        placeholder="Ingresa la direccion"
                        type="text"
                        classNames={{
                            label: "text-gray-500 text-base",
                        }}
                        variant="bordered" />
                </div>
            </div>
            <Button
                size="lg"
                onClick={UpdateCustomer}
                className="w-full mt-4 text-sm font-semibold"
                style={{
                    backgroundColor: theme.colors.third,
                    color: theme.colors.primary,
                }}
            >
                Guardar
            </Button>
        </>
    )
}
export default UpdateCustomerSales