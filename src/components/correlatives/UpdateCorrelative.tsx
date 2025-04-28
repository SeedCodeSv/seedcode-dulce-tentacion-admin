import { Autocomplete, AutocompleteItem, Input } from "@heroui/react";
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useCorrelativesStore } from '@/store/correlatives-store/correlatives.store';
import ButtonUi from '@/themes/ui/button-ui';
import { correlativesTypes } from '@/types/correlatives/correlatives_data.types';
import { Correlatives, IPropsCorrelativeUpdate } from '@/types/correlatives/correlatives_types';
import { Colors } from '@/types/themes.types';

function UpdateCorrelative({ correlative, onClose, reload }: IPropsCorrelativeUpdate) {
  const [datUpdateCorrelative, setDatUpdateCorrelative] = useState<Correlatives>({
    code: correlative?.code,
    typeVoucher: correlative?.typeVoucher,
    resolution: correlative?.resolution,
    from: correlative?.from,
    to: correlative?.to,
    next: correlative?.next,
    prev: correlative?.prev,
    serie: correlative?.serie,
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatUpdateCorrelative({
      ...datUpdateCorrelative,
      [e.target.name]: e.target.value,
    });
  };
  const { OnUpdateCorrelative } = useCorrelativesStore();
  const handleUpdateCorrelative = async () => {
    try {
      await OnUpdateCorrelative(correlative?.id ?? 0, datUpdateCorrelative).then(() => {
        toast.success('Se actualizo el correlativo');
        onClose();
        reload();
      });
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    setDatUpdateCorrelative(correlative as Correlatives);
  }, [correlative]);

  return (
    <div className="dark:text-white ">
      <div className="mt-5 grid grid-cols-2 gap-5 ">
        <div className="pt-2">
          <Input
            classNames={{
              label: 'text-gray-500 text-sm',
            }}
            defaultValue={correlative?.code}
            label="Código"
            labelPlacement="outside"
            name="code"
            placeholder="Código"
            value={datUpdateCorrelative.code?.trim() !== '' ? datUpdateCorrelative.code : 'N/A'}
            variant="bordered"
            onChange={handleChange}
          />
        </div>
        <div className="pt-2">
          <Autocomplete
            className="dark:text-white"
            classNames={{
              base: 'text-gray-500 text-sm',
            }}
            defaultSelectedKey={datUpdateCorrelative.typeVoucher}
            label="Tipo de Factura"
            labelPlacement="outside"
            placeholder="Selecciona el Tipo de Factura"
            value={datUpdateCorrelative.typeVoucher}
            variant="bordered"
            onSelectionChange={(e) => {
              const selectCorrelativeType = correlativesTypes.find(
                (dep) => dep.value === new Set([e]).values().next().value
              );

              setDatUpdateCorrelative({
                ...datUpdateCorrelative,
                typeVoucher: selectCorrelativeType?.value || '',
              });
            }}
          >
            {correlativesTypes.map((dep) => (
              <AutocompleteItem key={dep.value} className="dark:text-white">
                {dep.value + ' - ' + dep.label}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>
        <div className="pt-2">
          <Input
            classNames={{
              label: 'text-gray-500 text-sm',
            }}
            label="Resolución"
            labelPlacement="outside"
            name="resolution"
            placeholder="Ingresa la resolución"
            value={datUpdateCorrelative.resolution}
            variant="bordered"
            onChange={handleChange}
          />
        </div>
        <div className="pt-2">
          <Input
            classNames={{
              label: 'text-gray-500 text-sm',
            }}
            label="Serie"
            labelPlacement="outside"
            name="serie"
            placeholder="Ingresa la serie"
            value={datUpdateCorrelative.serie?.toString()}
            variant="bordered"
            onChange={handleChange}
          />
        </div>
        <div className="pt-2">
          <Input
            classNames={{
              label: 'text-gray-500 text-sm',
            }}
            label="Inicio"
            labelPlacement="outside"
            name="from"
            placeholder="Ingresa el inicio"
            value={datUpdateCorrelative.from}
            variant="bordered"
            onChange={handleChange}
          />
        </div>
        <div className="pt-2">
          <Input
            classNames={{
              label: 'text-gray-500 text-sm',
            }}
            label="Fin"
            labelPlacement="outside"
            name="to"
            placeholder="Ingresa el nombre de usuario"
            value={datUpdateCorrelative.to}
            variant="bordered"
            onChange={handleChange}
          />
        </div>
        <div className="pt-2">
          <Input
            classNames={{
              label: 'text-gray-500 text-sm',
            }}
            label="Anterior"
            labelPlacement="outside"
            name="prev"
            placeholder="Ingresa el anterior"
            type="number"
            value={datUpdateCorrelative.prev?.toString()}
            variant="bordered"
            onChange={handleChange}
          />
        </div>
        <div className="pt-2">
          <Input
            classNames={{
              label: 'text-gray-500 text-sm',
            }}
            label="Siguiente"
            labelPlacement="outside"
            name="next"
            placeholder="Ingresa el siguiente"
            value={datUpdateCorrelative.next?.toString()}
            variant="bordered"
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="w-full">
        <ButtonUi
          className="w-full mt-4 text-sm font-semibold"
          theme={Colors.Success}
          onPress={handleUpdateCorrelative}
        >
          Guardar
        </ButtonUi>
      </div>
    </div>
  );
}

export default UpdateCorrelative;
