import { Autocomplete, AutocompleteItem, Checkbox, Input, Select, SelectItem } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { Plus, Trash } from "lucide-react";
import { SeedcodeCatalogosMhService } from "seedcode-catalogos-mh";

import { CuerpoDocumento } from "@/shopping-branch-product/types/notes_of_remision.types";
import { TableComponent } from "@/themes/ui/table-ui";
import TdGlobal from "@/themes/ui/td-global";
import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";
import { preventLetters } from "@/utils";

export default function AddProductsShopping({ setDetails }: { setDetails: (products: CuerpoDocumento[]) => void }) {
    const services = useMemo(() => new SeedcodeCatalogosMhService(), []);
    const [addProducts, setAddProducts] = useState(false)
    const [products, setProducts] = useState<CuerpoDocumento[]>([
        {
            numItem: 1,
            tipoItem: 1,
            uniMedida: 0,
            numeroDocumento: null,
            cantidad: 0,
            codigo: "",
            codTributo: null,
            descripcion: "",
            precioUni: 0,
            montoDescu: 0,
            ventaNoSuj: 0,
            ventaExenta: 0,
            ventaGravada: 0,
            tributos: null
        },
    ])

    const addItem = () => {
        const itemss = [...products];

        itemss.push({
            numItem: products.length + 1,
            tipoItem: 1,
            uniMedida: 0,
            numeroDocumento: null,
            cantidad: 0,
            codigo: "",
            codTributo: null,
            descripcion: "",
            precioUni: 0,
            montoDescu: 0,
            ventaNoSuj: 0,
            ventaExenta: 0,
            ventaGravada: 0,
            tributos: null
        },);
        setProducts(itemss);
    };

    const onChange = (
        index: number,
        key: keyof CuerpoDocumento,
        value: string
    ) => {
        const newProducts = [...products];

        newProducts[index][key] = value as never;

        setProducts(newProducts);
    };

    const handleChangePrice = (index: number, price: string, quantity: string) => {
        const products_selected = [...products];
        const cantidad = Number(quantity);
        const ventaGravada = Number(price);

        if (cantidad > 0) {
            products_selected[index].precioUni = Number((ventaGravada / cantidad).toFixed(4));
        } else {
            products_selected[index].precioUni = 0;
        }

        setProducts(products_selected);
    };

    const remove = (numItem: number) => {
        if(numItem !==1 ){
        const updatedItems = products.filter((item) => item.numItem !== numItem);

        setProducts(updatedItems);}
    };

    useEffect(() => {
        if (addProducts) {
            setDetails(products)
        } else {
            setDetails([])
        }
    }, [addProducts, products])

    return (
        <>
            <Checkbox
            className="pt-5"
                isSelected={addProducts}
                size="lg"
                onValueChange={setAddProducts}
            >
                Ingresar Productos
            </Checkbox>
            {addProducts &&
                <div className="my-2">
                    <div className="w-full mt-4 border p-3 rounded-[12px]">
                      <div className="flex justify-between text-xl font-semibold">Productos
                                    <ButtonUi isIconOnly theme={Colors.Success} onPress={addItem}>
                                        <Plus size={20} />
                                    </ButtonUi>
                                </div>
                                <TableComponent
                                    headers={[' Tipo de item ', 'Un. de medida', 'Cantidad', 'Código', 'Descripción', 'Pre. unitario', 'Total Gravada', '']}

                                >
                                    {products.map((item, index) => (
                                        <tr key={index}>
                                            <TdGlobal className="p-3 w-1/6">
                                                <Select
                                                    isRequired
                                                    classNames={{ label: 'font-semibold' }}
                                                    placeholder="Selecciona el tipo de producto"
                                                    selectedKeys={[item.tipoItem.toString()]}
                                                    variant="bordered"
                                                    onSelectionChange={(key) => {
                                                        if (key) {
                                                            const value = new Set(key).values().next().value;

                                                            onChange(index, 'tipoItem', String(value))
                                                        }
                                                    }}
                                                >
                                                    {services.get011TipoDeItem().map((type) => (
                                                        <SelectItem key={type.codigo}>{type.valores}</SelectItem>
                                                    ))}
                                                </Select>
                                            </TdGlobal>
                                            <TdGlobal className="p-3 w-1/6">
                                                <Autocomplete
                                                    classNames={{ base: 'font-semibold' }}
                                                    placeholder="Selecciona la unidad de medida del producto"
                                                    selectedKey={item.uniMedida.toString()}
                                                    variant="bordered"
                                                    onSelectionChange={(key) => {
                                                        onChange(index, 'uniMedida', String(key))
                                                    }}
                                                >
                                                    {services.get014UnidadDeMedida().map((uni) => (
                                                        <AutocompleteItem key={uni.codigo}>{uni.valores}</AutocompleteItem>
                                                    ))}
                                                </Autocomplete>
                                            </TdGlobal>
                                            <TdGlobal className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                                <Input
                                                    classNames={{ label: 'font-semibold' }}
                                                    min={0}
                                                    name="cantidad"
                                                    placeholder=""
                                                    type="number"
                                                    value={String(item.cantidad)}
                                                    variant="bordered"
                                                    onChange={(e) => {

                                                        onChange(index, 'cantidad', e.target.value);
                                                        handleChangePrice(index, String(item.ventaGravada), e.target.value);
                                                    }}
                                                />
                                            </TdGlobal>
                                            <TdGlobal className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                                <Input
                                                    classNames={{ label: 'font-semibold' }}
                                                    name="codigo"
                                                    placeholder=""
                                                    value={String(item.codigo)}
                                                    variant="bordered"
                                                    onChange={(e) => onChange(index, 'codigo', e.target.value)}
                                                />
                                            </TdGlobal>
                                            <TdGlobal className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                                <Input
                                                    classNames={{ label: 'font-semibold' }}
                                                    name="descripcion"
                                                    placeholder=""
                                                    value={String(item.descripcion)}
                                                    variant="bordered"
                                                    onChange={(e) => onChange(index, 'descripcion', e.target.value)}
                                                />
                                            </TdGlobal>
                                            <TdGlobal className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                                {item.precioUni.toFixed(4)}
                                            </TdGlobal>
                                            <TdGlobal className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                                <Input
                                                    className="w-full"
                                                    classNames={{
                                                        label: 'font-semibold',
                                                    }}

                                                    value={item.ventaGravada.toString()}
                                                    variant="bordered"
                                                    onChange={(e) => {
                                                        let value = e.currentTarget.value.replace(/[^0-9.]/g, '');

                                                        if (item.ventaGravada === 0 && value !== '0' && value !== '') {
                                                            value = value.replace(/^0/, '');
                                                        }

                                                        if (value.startsWith('.')) value = '0' + value;
                                                        onChange(index, 'ventaGravada', value);
                                                        handleChangePrice(index, value, String(item.cantidad));
                                                    }}
                                                    onKeyDown={preventLetters}
                                                />

                                            </TdGlobal>
                                            <TdGlobal>
                                                <ButtonUi
                                                    isIconOnly
                                                    isDisabled={item.numItem === 1}
                                                    theme={Colors.Error}
                                                    onPress={() => {
                                                        remove(item.numItem)
                                                    }}
                                                >
                                                    <Trash />
                                                </ButtonUi>
                                            </TdGlobal>
                                        </tr>
                                    ))}
                                </TableComponent>
                    </div>
                </div>
            }
        </>
    )
}