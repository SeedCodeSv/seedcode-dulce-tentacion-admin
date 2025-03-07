import { ThemeContext } from '@/hooks/useTheme';
import { useCorrelativesStore } from '@/store/correlatives-store/correlatives.store';
import { correlativesTypes } from '@/types/correlatives/correlatives_data.types';
import { Correlatives, IPropsCorrelativeUpdate } from '@/types/correlatives/correlatives_types';
import { Autocomplete, AutocompleteItem, Button, Input } from "@heroui/react";
import { useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

function UpdateCorrelative({ correlative, onClose, reload }: IPropsCorrelativeUpdate) {
  const { theme } = useContext(ThemeContext);
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
            onChange={handleChange}
            defaultValue={correlative?.code}
            value={datUpdateCorrelative.code?.trim() !== '' ? datUpdateCorrelative.code : 'N/A'}
            label="Código"
            labelPlacement="outside"
            name="code"
            placeholder="Código"
            classNames={{
              label: 'text-gray-500 text-sm',
            }}
            variant="bordered"
          />
        </div>
        <div className="pt-2">
          <Autocomplete
            onSelectionChange={(e) => {
              const selectCorrelativeType = correlativesTypes.find(
                (dep) => dep.value === new Set([e]).values().next().value
              );
              setDatUpdateCorrelative({
                ...datUpdateCorrelative,
                typeVoucher: selectCorrelativeType?.value || '',
              });
            }}
            label="Tipo de Factura"
            value={datUpdateCorrelative.typeVoucher}
            defaultSelectedKey={datUpdateCorrelative.typeVoucher}
            labelPlacement="outside"
            placeholder="Selecciona el Tipo de Factura"
            variant="bordered"
            className="dark:text-white"
            classNames={{
              base: 'text-gray-500 text-sm',
            }}
          >
            {correlativesTypes.map((dep) => (
              <AutocompleteItem className="dark:text-white" key={dep.value}>
                {dep.value + ' - ' + dep.label}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>
        <div className="pt-2">
          <Input
            onChange={handleChange}
            label="Resolución"
            value={datUpdateCorrelative.resolution}
            labelPlacement="outside"
            name="resolution"
            placeholder="Ingresa la resolución"
            classNames={{
              label: 'text-gray-500 text-sm',
            }}
            variant="bordered"
          />
        </div>
        <div className="pt-2">
          <Input
            onChange={handleChange}
            label="Serie"
            labelPlacement="outside"
            name="serie"
            value={datUpdateCorrelative.serie?.toString()}
            placeholder="Ingresa la serie"
            classNames={{
              label: 'text-gray-500 text-sm',
            }}
            variant="bordered"
          />
        </div>
        <div className="pt-2">
          <Input
            onChange={handleChange}
            label="Inicio"
            value={datUpdateCorrelative.from}
            labelPlacement="outside"
            name="from"
            placeholder="Ingresa el inicio"
            classNames={{
              label: 'text-gray-500 text-sm',
            }}
            variant="bordered"
          />
        </div>
        <div className="pt-2">
          <Input
            onChange={handleChange}
            label="Fin"
            labelPlacement="outside"
            name="to"
            value={datUpdateCorrelative.to}
            placeholder="Ingresa el nombre de usuario"
            classNames={{
              label: 'text-gray-500 text-sm',
            }}
            variant="bordered"
          />
        </div>
        <div className="pt-2">
          <Input
            onChange={handleChange}
            label="Anterior"
            labelPlacement="outside"
            name="prev"
            placeholder="Ingresa el anterior"
            type="number"
            value={datUpdateCorrelative.prev?.toString()}
            classNames={{
              label: 'text-gray-500 text-sm',
            }}
            variant="bordered"
          />
        </div>
        <div className="pt-2">
          <Input
            onChange={handleChange}
            label="Siguiente"
            labelPlacement="outside"
            name="next"
            value={datUpdateCorrelative.next?.toString()}
            placeholder="Ingresa el siguiente"
            classNames={{
              label: 'text-gray-500 text-sm',
            }}
            variant="bordered"
          />
        </div>
      </div>

      <div className="w-full">
        <Button
          onClick={handleUpdateCorrelative}
          className="w-full mt-4 text-sm font-semibold"
          style={{
            backgroundColor: theme.colors.third,
            color: theme.colors.primary,
          }}
        >
          Guardar
        </Button>
      </div>
    </div>
  );
}

export default UpdateCorrelative;
