import { Autocomplete, AutocompleteItem, Input } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import debounce from "debounce";
import { toast } from "sonner";

import ModalGlobal from "@/components/global/ModalGlobal";
import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";
import { messages } from "@/utils/constants";
import { Product } from "@/types/products.types";
import { useProductsStore } from "@/store/products.store";
interface Props {
  product: Product | undefined
  onClose: () => void
  isOpen: boolean
}

export default function ConvertProduct({ product, onClose, isOpen }: Props) {
  const {
    productsFilteredList,
    getProductsFilteredList,
    onConvertProduct,
    patchConvertProduct,
    getConvertProduct,
    convertedProduct,
  } = useProductsStore();

  const [search, setSearch] = useState('');
  const [payload, setPayload] = useState({
    productId: product?.id ?? 0,
    convertedProductId: 0,
    quantity: 0,
  });

  const isEditing = !!convertedProduct?.id;

  // Cargar el producto convertido (si existe)
  useEffect(() => {
    if (product?.id) {
      getConvertProduct(product.id);
    }
  }, [product?.id]);

  // Cuando se obtenga convertedProduct, actualizar el payload
  useEffect(() => {
    if (convertedProduct) {
      setPayload({
        productId: convertedProduct.productId,
        convertedProductId: convertedProduct.convertedProductId,
        quantity: convertedProduct.quantity,
      });
      getProductsFilteredList({ productName: convertedProduct.convertedProduct?.name ?? '', code: '' });
    } else {
      setPayload({
        productId: product?.id ?? 0,
        convertedProductId: 0,
        quantity: 0,
      });
    }
  }, [convertedProduct]);

  // Buscar productos al montar o al escribir
  const handleSearchProduct = useCallback(
    debounce((value: string) => {
      getProductsFilteredList({ productName: value, code: '' });
    }, 300),
    []
  );

  useEffect(() => {
    getProductsFilteredList({ productName: search ?? '', code: '' });
  }, []);

  // Enviar datos
  const handleSubmit = async () => {
    if (payload.convertedProductId === 0) {
      toast.error('Debes seleccionar el producto a convertir');

      return;
    }

    if (payload.quantity <= 0) {
      toast.error('Debes ingresar una cantidad mayor a cero');

      return;
    }

    let res;

    if (isEditing && convertedProduct?.id) {
      // Actualizar conversión existente
      res = await patchConvertProduct({
        productId: product?.id ?? 0,
        convertedProductId: payload.convertedProductId,
        quantity: payload.quantity,
      }, convertedProduct.id);
    } else {
      // Crear nueva conversión
      res = await onConvertProduct({
        productId: product?.id ?? 0,
        convertedProductId: payload.convertedProductId,
        quantity: payload.quantity,
      });
    }

    if (res) {
      toast.success(isEditing ? 'Conversión actualizada correctamente' : 'Conversión registrada con éxito');
      onClose();
    } else {
      toast.error(messages.error);
    }
  };


  return (
    <ModalGlobal
      isBlurred={true}
      isOpen={isOpen}
      size="w-full lg:w-[30vw]"
      title={isEditing ? 'Editar Conversión' : 'Convertir Producto'}
      onClose={onClose}
    >
      <div className="p-4 flex flex-col gap-2">
        <Input
          isReadOnly
          classNames={{ label: 'font-semibold' }}
          label="Nombre del Producto"
          labelPlacement="outside"
          value={product?.name}
          variant="bordered"
        />

        <Autocomplete
          isClearable
          className="font-semibold dark:text-white w-full"
          label="Producto a convertir"
          labelPlacement="outside"
          listboxProps={{ emptyContent: 'Escribe para buscar' }}
          placeholder="Selecciona un producto"
          selectedKey={String(payload.convertedProductId)}
          variant="bordered"
          onClear={() => setPayload({ ...payload, convertedProductId: 0 })}
          onInputChange={(value) => {
            handleSearchProduct(value);
            setSearch(value);
          }}
          onSelectionChange={(key) =>
            setPayload({ ...payload, convertedProductId: Number(key) })
          }
        >
          {productsFilteredList.map((item) => (
            <AutocompleteItem key={item.id} className="dark:text-white">
              {item.name}
            </AutocompleteItem>
          ))}
        </Autocomplete>

        <Input
          classNames={{ label: 'font-semibold' }}
          label="Dividir en:"
          labelPlacement="outside"
          placeholder="0"
          type="number"
          value={String(payload.quantity)}
          variant="bordered"
          onChange={(e) =>
            setPayload({ ...payload, quantity: Number(e.target.value) })
          }
        />

        <ButtonUi
          className="w-full mt-4 text-sm font-semibold"
          theme={isEditing ? Colors.Info : Colors.Primary}
          onPress={handleSubmit}
        >
          {isEditing ? 'Actualizar' : 'Guardar'}
        </ButtonUi>
      </div>
    </ModalGlobal>
  );
}
