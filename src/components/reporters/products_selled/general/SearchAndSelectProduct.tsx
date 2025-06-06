
import { Checkbox, Input } from "@heroui/react";
import classNames from "classnames";
import debounce from "debounce";
import { Box, Search } from "lucide-react";
import { useCallback, useState } from "react";

import { useProductsStore } from "@/store/products.store";

type Product = { id: number; name: string };

export default function SearchAndSelectProduct() {
    const { productsFilteredList, getProductsFilteredList } = useProductsStore()
    const [products, setProducts] = useState<{ id: number; name: string }[]>([]);
    const [search, setSearch] = useState('')

    const handleAddProduct = (itemplier: Product) => {
        const list_products = [...products];

        const checkIfExist = list_products.findIndex((lsP) => lsP.id === itemplier.id);

        if (checkIfExist === -1) {
            list_products.push(itemplier);
        } else {
            list_products.splice(checkIfExist, 1);
        }

        setProducts(list_products);

    };

    const checkIsSelectedProduct = (id: number) => {
        return products.some((ssp) => ssp.id === id);
    };

    const handleSearchProduct = useCallback(
        debounce((value: string) => {
            getProductsFilteredList({
                productName: value,
            });
        }, 300),
        []
    );


    return (
        <>
            <div className="flex gap-5 items-end">
                <Input
                    className="dark:text-white"
                    classNames={{
                        label: 'font-semibold',
                    }}
                    label="Buscar Producto"
                    labelPlacement="outside"
                    placeholder="Escribe para buscar"
                    startContent={<Search />}
                    type="text"
                    value={search}
                    variant="bordered"
                    onChange={(e) => {
                        setSearch(e.target.value)
                        handleSearchProduct(e.target.value);
                    }}
                />
            </div>
            <div className="flex flex-col overflow-y-auto h-full w-full gap-3">
                {productsFilteredList.map((item) => (
                    <button
                        key={item.id}
                        className={classNames(
                            checkIsSelectedProduct(item.id)
                                ? 'shadow-green-100 dark:shadow-gray-500 border-green-400 dark:border-gray-800 bg-green-50 dark:bg-gray-950'
                                : '',
                            'shadow border dark:border-gray-600 w-full flex flex-col justify-start rounded-[12px] p-4'
                        )}
                        onClick={() => handleAddProduct(item)}
                    >
                        <div className="flex justify-between gap-5 w-full">
                            <p className="text-sm font-semibold dark:text-white">{item.name}</p>
                            <Checkbox
                                checked={checkIsSelectedProduct(item.id)}
                                isSelected={checkIsSelectedProduct(item.id)}
                                onValueChange={() => {
                                    handleAddProduct(item);
                                }}
                            />
                        </div>
                        <div className="w-full dark:text-white flex flex-col justify-start text-left mt-2">
                            <p className="w-full dark:text-white">Código: {item.code}</p>
                            <p className="w-full dark:text-white">Descripción: {item.description}</p>
                        </div>
                    </button>
                ))}
                {productsFilteredList.length === 0 && (
                    <div className="flex flex-col justify-center items-center mt-5">
                        <Box size={100} />
                        <p className="text-sm font-semibold mt-6">No se encontraron productos</p>
                    </div>
                )}
            </div>
        </>
    )
}