import { Autocomplete, AutocompleteItem, Input, useDisclosure } from "@heroui/react";
import { RefreshCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import debounce from "debounce";
import { toast } from "sonner";

import ModalGlobal from "@/components/global/ModalGlobal";
import ButtonUi from "@/themes/ui/button-ui";
import { IGetBranchProduct } from "@/types/branches.types";
import { Colors } from "@/types/themes.types";
import { useBranchProductStore } from "@/store/branch_product.store";
import { messages } from "@/utils/constants";
interface Props {
  branchProduct: IGetBranchProduct
}

export default function ConvertProduct({ branchProduct }: Props) {
  const modalConvert = useDisclosure()
  const { onConvertProduct, getBranchProductsSearch, founded_products } = useBranchProductStore()
  const [search, setSearch] = useState('')
  const [payload, setPayload] = useState(
    {
      branchProductId: branchProduct.id,
      convertedBranchProductId: 0,
      quantity: 0

    }
  )
  const handleSubmit = async () => {
    if (payload.convertedBranchProductId === 0) {
      toast.error('Debes seleccionar el producto a convertir')

      return
    }

     if (payload.quantity <= 0) {
      toast.error('Debes ingresar una cantidad mayor a cero')

      return
    }

    const res = await onConvertProduct(payload)

    if (res) {
      toast.success(messages.success)
      modalConvert.onClose()
    }
    else {
      toast.error(messages.error)

    }
  }

  const handleSearchProduct = useCallback(
    debounce((value: string) => {
      getBranchProductsSearch({
        branchId: branchProduct.branch.id,
        productName: value
      });
    }, 300),
    [branchProduct.branch.id]
  );

  useEffect(() => {
    getBranchProductsSearch({ branchId: branchProduct.branch.id, productName: search})
  }, [])



  return (
    <>
      <ButtonUi
        isIconOnly
        showTooltip
        theme={Colors.Info}
        tooltipText='Convertir Producto'
        onPress={() => modalConvert.onOpen()}
      >
        <RefreshCcw />
      </ButtonUi>
      <ModalGlobal
        isBlurred={true}
        isOpen={modalConvert.isOpen}
        size='w-full lg:w-[30vw]'
        title='Convertir Producto'
        onClose={() => {
          modalConvert.onClose()
        }}

      >
        <div className="p-4 flex flex-col gap-2">
          <Input
            classNames={{ label: 'font-semibold' }}
            label='Nombre del Producto'
            labelPlacement="outside"
            value={branchProduct.product.name}
            variant="bordered"
          />
          <Autocomplete
            isClearable
            className="font-semibold dark:text-white w-full"
            label="Producto a convertir"
            labelPlacement="outside"
            listboxProps={{
              emptyContent: "Escribe para buscar",
            }}
            placeholder="Selecciona un producto"
            selectedKey={String(payload.convertedBranchProductId)}
            variant="bordered"
            onClear={() => setPayload({ ...payload, convertedBranchProductId: 0 })}
            onInputChange={(value) => {
              handleSearchProduct(value);
              setSearch(value)
            }}
            onSelectionChange={(key) => {
              setPayload({
                ...payload,
                convertedBranchProductId: Number(key)
              })
            }}
          >
            {founded_products.map((bp) => (
              <AutocompleteItem key={bp.id} className="dark:text-white">
                {bp.product.name}
              </AutocompleteItem>
            ))}
          </Autocomplete>

          <Input
            classNames={{ label: 'font-semibold' }}
            label='Dividir en:'
            labelPlacement="outside"
            placeholder="0"
            variant="bordered"
            onChange={(e) => setPayload({ ...payload, quantity: Number(e.target.value) })}
          />
          <ButtonUi
            isDisabled
            className="w-full mt-4 text-sm font-semibold"
            theme={Colors.Primary}
            onPress={() => handleSubmit()}
          >
            Guardar
          </ButtonUi>
        </div>
      </ModalGlobal>
    </>
  )
}