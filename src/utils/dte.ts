export const generate_control = (
    tipo_sol: string,
    codStable: string,
    codPVenta: string,
    nTicket: string
  ) => {
    return `DTE-${tipo_sol}-${codStable + codPVenta}-${nTicket}`;
  };
  
  export function reemplazarNumero(str: string, numero: number) {
    const nuevoNumero = numero.toString().padStart(14, "0");
    return str.replace(/\d{14}$/, nuevoNumero);
  }
  