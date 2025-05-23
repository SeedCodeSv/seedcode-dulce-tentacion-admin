export const generate_control = (
  tipo_sol: string,
  codStable: string,
  codPVenta: string,
  nTicket: string
) => {
  return `DTE-${tipo_sol}-${codStable + codPVenta}-${nTicket}`;
};

export function reemplazarNumero(str: string, numero: number) {
  const nuevoNumero = numero.toString().padStart(14, '0');

  return str.replace(/\d{14}$/, nuevoNumero);
}

export const formatCurrency = (value: number | undefined | null): string => {
  if (value == null || isNaN(value)) {
    return "$0.00";
  }

  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const documentsTypeReceipt = [
  {
    id: 2,
    codigo: '13',
    valores: 'DUI',
  },
  {
    id: 1,
    codigo: '36',
    valores: 'NIT',
  },
  {
    id: 3,
    codigo: '37',
    valores: 'Otro',
  },
  {
    id: 4,
    codigo: '03',
    valores: 'Pasaporte',
  },
  {
    id: 5,
    codigo: '02',
    valores: 'Carnet de Residente',
  },
];
export const formatCurrencySales = (value: number | bigint) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};
