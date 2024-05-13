export function convertCurrencyFormat(input: string) {
    // Separar la cantidad y los centavos
    const [amount, cents = "00"] = input.includes(".")
      ? input.split(".")
      : [input];
  
    // Función para convertir números a palabras
    const numberToWords = (num: number) => {
      const units = [
        "",
        "UNO",
        "DOS",
        "TRES",
        "CUATRO",
        "CINCO",
        "SEIS",
        "SIETE",
        "OCHO",
        "NUEVE",
        "DIEZ",
        "ONCE",
        "DOCE",
        "TRECE",
        "CATORCE",
        "QUINCE",
        "DIECISEIS",
        "DIECISIETE",
        "DIECIOCHO",
        "DIECINUEVE",
      ];
      const tens = [
        "",
        "",
        "VEINTE",
        "TREINTA",
        "CUARENTA",
        "CINCUENTA",
        "SESENTA",
        "SETENTA",
        "OCHENTA",
        "NOVENTA",
      ];
  
      if (num < 20) {
        return units[num];
      } else {
        const unit = num % 10;
        const ten = Math.floor(num / 10);
        if (unit === 0) {
          return tens[ten];
        } else {
          return tens[ten] + " Y " + units[unit];
        }
      }
    };
  
    // Convertir cantidad a palabras
    const amountInWords = numberToWords(parseInt(amount));
  
    // Formatear los centavos
    const centsFormatted = cents.padEnd(2, "0");
  
    return `${amountInWords} ${centsFormatted}/100 DOLARES AMERICANOS`;
  }