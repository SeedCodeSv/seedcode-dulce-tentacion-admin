
import { Checkbox, Input, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/react";
import classNames from "classnames";
import debounce from "debounce";
import { Box, Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { useProductsStore } from "@/store/products.store";
import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";

type Product = { id: number; name: string; code: string; description: string };

export default function SearchAndSelectProduct() {
  const { productsFilteredList, getProductsFilteredList } = useProductsStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const productsModal = useDisclosure();

  const selectedIds = useMemo(() => new Set(products.map(p => p.id)), [products]);

  const toggleProduct = (product: Product) => {
    setProducts(prev =>
      selectedIds.has(product.id)
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product]
    );
  };

  const isSelected = (id: number) => selectedIds.has(id);

  const handleSearchProduct = useCallback(
    debounce((value: string) => {
      getProductsFilteredList({ productName: value });
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearch(value);
    handleSearchProduct(value);
  };

  return (
    <>
      <div className="flex gap-5 items-end col-span-2 md:col-span-1">
        <Input
          readOnly
          className="w-full dark:text-white"
          classNames={{ label: 'font-semibold dark:text-white text-gray-500 text-sm' }}
          label="Productos"
          labelPlacement="outside"
          placeholder="Selecciona los productos"
          value={products.map(p => p.name).join(', ')}
          variant="bordered"
        />
        <ButtonUi isIconOnly theme={Colors.Info} onPress={productsModal.onOpen}>
          <Search />
        </ButtonUi>
      </div>

      <Modal {...productsModal} scrollBehavior="inside" size="xl">
        <ModalContent>
          <ModalHeader>Selecciona los productos</ModalHeader>
          <ModalBody className="flex flex-col h-full overflow-y-auto">
            <div className="flex gap-5 items-end">
              <Input
                className="dark:text-white"
                classNames={{ label: 'font-semibold' }}
                label="Buscar Producto"
                labelPlacement="outside"
                placeholder="Escribe para buscar"
                startContent={<Search />}
                type="text"
                value={search}
                variant="bordered"
                onChange={handleSearchChange}
              />
            </div>

            <div className="flex flex-col overflow-y-auto h-full w-full gap-3">
              {productsFilteredList.map((item) => {
                const selected = isSelected(item.id);

                return (
                  <button
                    key={item.id}
                    className={classNames(
                      selected
                        ? 'shadow-green-100 dark:shadow-gray-500 border-green-400 dark:border-gray-800 bg-green-50 dark:bg-gray-950'
                        : '',
                      'shadow border dark:border-gray-600 w-full flex flex-col justify-start rounded-[12px] p-4'
                    )}
                    onClick={() => toggleProduct(item)}
                  >
                    <div className="flex justify-between gap-5 w-full">
                      <p className="text-sm font-semibold dark:text-white">{item.name}</p>
                      <Checkbox
                        checked={selected}
                        isSelected={selected}
                        onValueChange={() => toggleProduct(item)}
                      />
                    </div>
                    <div className="w-full dark:text-white flex flex-col justify-start text-left mt-2">
                      <p>Código: {item.code}</p>
                      <p>Descripción: {item.description}</p>
                    </div>
                  </button>
                );
              })}

              {productsFilteredList.length === 0 && (
                <div className="flex flex-col justify-center items-center mt-5">
                  <Box size={100} />
                  <p className="text-sm font-semibold mt-6">No se encontraron productos</p>
                </div>
              )}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
