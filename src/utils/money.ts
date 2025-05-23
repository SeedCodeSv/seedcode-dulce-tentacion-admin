export function convertCurrencyFormat(input: string) {
  const [amount, cents = '00'] = input.includes('.') ? input.split('.') : [input];

  const numberToWords = (num: number): string => {
    const units = [
      '',
      'UNO',
      'DOS',
      'TRES',
      'CUATRO',
      'CINCO',
      'SEIS',
      'SIETE',
      'OCHO',
      'NUEVE',
      'DIEZ',
      'ONCE',
      'DOCE',
      'TRECE',
      'CATORCE',
      'QUINCE',
      'DIECISEIS',
      'DIECISIETE',
      'DIECIOCHO',
      'DIECINUEVE',
    ];
    const tens = [
      '',
      '',
      'VEINTE',
      'TREINTA',
      'CUARENTA',
      'CINCUENTA',
      'SESENTA',
      'SETENTA',
      'OCHENTA',
      'NOVENTA',
    ];
    const hundreds = [
      '',
      'CIEN',
      'DOSCIENTOS',
      'TRESCIENTOS',
      'CUATROCIENTOS',
      'QUINIENTOS',
      'SEISCIENTOS',
      'SETECIENTOS',
      'OCHOCIENTOS',
      'NOVECIENTOS',
    ];

    if (num < 20) return units[num];
    if (num < 100) {
      const unit = num % 10;
      const ten = Math.floor(num / 10);

      return unit === 0 ? tens[ten] : `${tens[ten]} Y ${units[unit]}`;
    }
    if (num < 1000) {
      const hundred = Math.floor(num / 100);
      const remainder = num % 100;
      const remainderInWords = remainder > 0 ? ` ${numberToWords(remainder)}` : '';

      return hundreds[hundred] + remainderInWords;
    }
    if (num < 1000000) {
      const thousands = Math.floor(num / 1000);
      const remainder = num % 1000;
      const thousandsInWords = thousands > 1 ? numberToWords(thousands) + ' MIL' : 'MIL';
      const remainderInWords = remainder > 0 ? ` ${numberToWords(remainder)}` : '';

      return thousandsInWords + remainderInWords;
    }

    return '';
  };

  const amountInWords = numberToWords(parseInt(amount));
  const centsFormatted = cents.padEnd(2, '0');

  return `${amountInWords} ${centsFormatted}/100 DOLARES AMERICANOS`;
}


export const formatCurrencyWithout$ = (value: number) => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const calc_iva = (total: number) => {
  const iva = total * 0.13
  const total_with_iva = total + iva

  return {
    iva,
    total_with_iva
  }
}