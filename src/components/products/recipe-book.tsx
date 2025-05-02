import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import React from 'react';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router';

import { useProductsStore } from '@/store/products.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

interface Props {
  productId: number;
  onOpenChange: () => void;
  isOpen: boolean;
}

function RecipeBook({ productId, onOpenChange, isOpen }: Props) {
  const { recipeBook, getRecipeBook, loadingRecipeBook } = useProductsStore();

  React.useEffect(() => {
    getRecipeBook(productId);
  }, [productId]);

  const navigate = useNavigate();

  return (
    <Modal isOpen={isOpen} scrollBehavior="inside" size="2xl" onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>Receta del producto</ModalHeader>
        <ModalBody>
          {loadingRecipeBook && (
            <div className="py-4 flex justify-center items-center">
              <div className="loader" />
            </div>
          )}
          {!recipeBook && !loadingRecipeBook && (
            <div className="flex flex-col justify-center items-center py-10">
              <X color="red" size={80} />
              <p className="font-normal mt-2">No hay receta disponible para este producto</p>
            </div>
          )}
          {!loadingRecipeBook && recipeBook && (
            <>
              <p className="font-semibold">{recipeBook.product.name}</p>
              <p>Código: {recipeBook.product.code}</p>
              <p>Descripción: {recipeBook.product.description}</p>

              <p className="font-semibold mt-5">Receta</p>
              {recipeBook.productRecipeBookDetails.map((detail) => {
                return (
                  <div
                    key={detail.id}
                    className="w-full flex flex-col shadow border p-3 rounded-[12px]"
                  >
                    <p className="font-semibold">{detail.product.name}</p>
                    <p className="text-sm">
                      <span className="font-semibold">Código:</span> {detail.product.code}
                    </p>
                    <p className="mt-3 text-sm">
                      <span className="font-semibold">Cantidad por unidad:</span> {detail.quantity}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Unidad de medida:</span>{' '}
                      {FormatNameUnit(detail.extraUniMedida)}
                    </p>
                  </div>
                );
              })}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <ButtonUi
            isLoading={loadingRecipeBook}
            theme={Colors.Success}
            onPress={() => navigate(`/add-product-recipe/${productId}/${recipeBook?.id || '0'}`)}
          >
            {recipeBook ? 'Editar receta' : 'Agregar receta'}
          </ButtonUi>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default RecipeBook;

export const FormatNameUnit = (name: string) => {
  const services = new SeedcodeCatalogosMhService();

  const find = services.get014UnidadDeMedida().find((item) => item.codigo === name);

  return find ? find.valores : '-';
};
