import { Autocomplete, AutocompleteItem, Button, Input } from "@heroui/react";
import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useAccountCatalogsStore } from '@/store/accountCatalogs.store';
import { CodCuentaProps } from '@/pages/contablilidad/types/types';

export const CodCuentaSelect = (props: CodCuentaProps) => {
  const { account_catalog_pagination, loading } = useAccountCatalogsStore();
  const { isReadOnly = false } = props;
  const LIMIT = 20;

  // Inicializa solo con el código
  const initialCode = props.items[props.index].codCuenta || '';
  const initialDesc = props.items[props.index].descCuenta || '';
  const [name, setName] = useState(initialCode ? `${initialCode} - ${initialDesc}` : '');

  const itemsPag = useMemo(() => {
    const sortedItems = account_catalog_pagination.accountCatalogs.sort((a, b) =>
      a.code.localeCompare(b.code)
    );

    if (name.trim() !== '') {
      // Si se está escribiendo algo que no incluye " - ", filtra por código
      return sortedItems
        .filter((item) => (item.code + ' - ' + item.name).startsWith(name))
        .slice(0, LIMIT);
    }

    return sortedItems.slice(0, LIMIT); // Devuelve la lista completa si no hay búsqueda
  }, [account_catalog_pagination, name]);

  const onChange = (key: string) => {
    if (key) {
      const items = [...props.items];
      const value = String(key);

      const itemFind = account_catalog_pagination.accountCatalogs.find(
        (item) => item.code === value
      );

      if (itemFind) {
        if (itemFind.subAccount) {
          toast.error('No se puede agregar una cuenta con sub-cuentas');

          return;
        }

        const item = items[props.index];

        item.codCuenta = itemFind.code;
        item.descCuenta = itemFind.name;
        props.setItems([...items]);

        // Actualiza el input con "code - name"
        setName(`${itemFind.code} - ${itemFind.name}`);
      }
    }
  };

  useEffect(() => {
    const updatedCode = props.items[props.index].codCuenta || '';
    const updatedDesc = props.items[props.index].descCuenta || '';

    setName(updatedCode ? `${updatedCode} - ${updatedDesc}` : '');
  }, [props.items, props.index]);

  const handleInputChange = (e: string) => {
    setName(e); // Actualiza el estado solo cuando el usuario escribe
  };

  return (
    <>
    {isReadOnly ? <Input readOnly value={props.items[props.index].codCuenta + " - " + props.items[props.index].descCuenta} variant='bordered' /> : <Autocomplete
      aria-describedby="Cuenta"
        aria-labelledby="Cuenta"
        className="min-w-52"
        inputProps={{
          classNames: {
            inputWrapper: 'pl-1',
          },
        }}
        isLoading={loading}
        placeholder="Buscar cuenta"
        readOnly={isReadOnly}
        selectedKey={props.items[props.index].codCuenta} // Selecciona usando el código
        startContent={
          <Button isIconOnly isDisabled={isReadOnly} size="sm" onPress={() => props.openCatalogModal(props.index)}>
            <Search />
          </Button>
        }
        variant="bordered"
        onInputChange={handleInputChange} // Usa una función dedicada para cambios en el input
        onSelectionChange={(key) => {
          if (key) {
            onChange(String(key));
          }
        }}
      >
        {itemsPag.map((account) => (
          <AutocompleteItem
            key={account.code}
            textValue={`${account.code} - ${account.name}`}
          >
            {account.code} - {account.name} {/* Muestra ambos en las opciones */}
          </AutocompleteItem>
        ))}
      </Autocomplete> }
      
    </>
  );
};
