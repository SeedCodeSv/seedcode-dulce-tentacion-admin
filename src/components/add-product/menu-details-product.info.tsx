import { Checkbox, Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Colors } from '@/types/themes.types';
import ButtonUi from '@/themes/ui/button-ui';
import { useProductsStore } from '@/store/products.store';

function MenuDetailsProductInfo() {
  const [includesPrescription, setIncludesPrescription] = useState(false);

  const { paginated_products, getPaginatedProducts } = useProductsStore();
  // const [selectedTypeSearch, setSelectedTypeSearch] = useState<'NOMBRE' | 'CODIGO'>('NOMBRE');

  const [name] = useState('');

  useEffect(() => {
    getPaginatedProducts(1, 20, '', '', name, '', 1);
  }, []);

  return (
    <div className="w-full border shadow rounded-[12px] p-5 mt-3">
      <p className="text-xl font-semibold dark:text-white py-3">Recetario</p>
      <div className="shadow border rounded-[12px] p-5">
        <div className="flex justify-between">
          <Checkbox
            checked={includesPrescription}
            defaultChecked={includesPrescription}
            size="lg"
            onValueChange={setIncludesPrescription}
          >
            <span className="dark:text-white font-semibold">Incluye receta</span>
          </Checkbox>
          {includesPrescription && (
            <>
              <ButtonUi isIconOnly theme={Colors.Success}>
                <Plus />
              </ButtonUi>
            </>
          )}
        </div>
      </div>
      <Modal isOpen size="2xl">
        <ModalContent>
          <ModalHeader>Selecciona los productos de la receta</ModalHeader>
          <ModalBody>
            {paginated_products.products.map((bpr) => (
              <div key={bpr.id}>{bpr.code}</div>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default MenuDetailsProductInfo;
