import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useBillingStore } from "../../store/facturation/billing.store";
import { useEffect } from "react";
import { useCustomerStore } from "../../store/customers.store";

function FormMakeSale() {
  const {
    metodos_de_pago,
    getCat017FormasDePago,
    getCat02TipoDeDocumento,
    tipos_de_documento,
  } = useBillingStore();

  const {} = useCustomerStore()

  useEffect(() => {
    getCat017FormasDePago();
    getCat02TipoDeDocumento();
  }, []);

  return (
    <div>
      <Autocomplete
        variant="bordered"
        label="Cliente a facturar"
        labelPlacement="outside"
        placeholder="Selecciona el cliente"
        size="lg"
      >
        <AutocompleteItem key={1} value="Item 1" />
        <AutocompleteItem key={2} value="Item 2" />
        <AutocompleteItem key={3} value="Item 3" />
      </Autocomplete>
      <Autocomplete
        className="pt-5"
        variant="bordered"
        label="Método de pago"
        labelPlacement="outside"
        placeholder="Selecciona el método de pago"
        size="lg"
      >
        {metodos_de_pago.map((item) => (
          <AutocompleteItem key={item.codigo} value={item.codigo}>
            {item.valores}
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <Autocomplete
        className="pt-5"
        variant="bordered"
        label="Tipo de documento a emitir"
        labelPlacement="outside"
        placeholder="Selecciona el tipo de documento"
        size="lg"
      >
        {tipos_de_documento.map((item) => (
          <AutocompleteItem key={item.codigo} value={item.codigo}>
            {item.valores}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </div>
  );
}

export default FormMakeSale;
