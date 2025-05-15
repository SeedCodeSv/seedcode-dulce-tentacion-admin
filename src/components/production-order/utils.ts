import { SeedcodeCatalogosMhService } from "seedcode-catalogos-mh"

const services = new SeedcodeCatalogosMhService()

export const formatNameUniMedida = (code: string) => {
    const find = services.get014UnidadDeMedida().find((item) => item.codigo === code)

    return find ? find.valores : '-'
}

type ConversionMap = {
  [unitCode: string]: number; // multiplicador para convertir A la unidad base
};

type MeasureCategory = {
  base: string;
  units: ConversionMap;
};

type UnitsDictionary = {
  [category: string]: MeasureCategory;
};

export const conversionDictionary: UnitsDictionary = {
  longitud: {
    base: '1', // metro
    units: {
      '1': 1, // metro
      '2': 0.9144, // yarda
      '6': 0.001, // milímetro
    },
  },
  area: {
    base: '13', // metro cuadrado
    units: {
      '13': 1, // metro cuadrado
      '9': 1_000_000, // kilómetro cuadrado
      '10': 10_000, // hectárea
      '15': 0.6987, // vara cuadrada (aproximado)
    },
  },
  volumen: {
    base: '18', // metro cúbico
    units: {
      '18': 1, // metro cúbico
      '20': 0.158987, // barril
      '22': 0.00378541, // galón
      '23': 0.001, // litro
      '24': 0.00075, // botella (supuesto de 750 ml)
      '26': 0.000001, // mililitro
    },
  },
  masa: {
    base: '39', // gramo
    units: {
      '30': 1_000_000, // tonelada
      '32': 100_000, // quintal
      '33': 25_000, // arroba
      '34': 1000, // kilogramo
      '36': 453.592, // libra
      '37': 31.1035, // onza troy
      '38': 28.3495, // onza
      '39': 1, // gramo
    },
  },
  potencia: {
    base: '43', // kilowatt
    units: {
      '43': 1,
      '44': 0.001,
    },
  },
  energia: {
    base: '51', // kilowatt-hora
    units: {
      '29': 1_000_000, // gigawatt-hora
      '30': 1000, // megawatt-hora
      '51': 1,
      '52': 0.001,
    },
  },
  voltaje: {
    base: '53', // kilovoltio
    units: {
      '53': 1,
      '54': 0.001,
    },
  },
  potencia_aparente: {
    base: '46', // kilovoltio-amperio
    units: {
      '45': 0.000001, // megavoltio-amperio
      '46': 1, // kilovoltio-amperio
      '47': 0.001, // voltio-amperio
    },
  },
  cantidad: {
    base: '59', // unidad
    units: {
      '59': 1,
      '58': 12,
      '57': 100,
      '56': 500,
      '55': 1000,
    },
  },
  otros: {
    base: '99', // otra
    units: {
      '99': 1,
    },
  },
};

export function convertUnit(
  value: number,
  fromCode: string,
  toCode: string
): number {

  const dictionary = conversionDictionary;

  for (const category of Object.values(dictionary)) {
    if (fromCode in category.units && toCode in category.units) {
      const toBase = value * category.units[fromCode];

      return toBase / category.units[toCode];
    }
  }

  return value
}

export const unitShortNames: Record<string, string> = {
  '1': 'm',
  '2': 'yd',
  '6': 'mm',
  '9': 'km²',
  '10': 'ha',
  '13': 'm²',
  '15': 'vq',
  '18': 'm³',
  '20': 'bbl',
  '22': 'gal',
  '23': 'L',
  '24': 'bot',
  '26': 'mL',
  '30': 't',
  '32': 'qq',
  '33': 'arroba',
  '34': 'kg',
  '36': 'lb',
  '37': 'oz t',
  '38': 'oz',
  '39': 'g',
  '43': 'kW',
  '44': 'W',
  '45': 'MVA',
  '46': 'kVA',
  '47': 'VA',
  '49': 'GWh',
  '50': 'MWh',
  '51': 'kWh',
  '52': 'Wh',
  '53': 'kV',
  '54': 'V',
  '55': 'mil',
  '56': '½mil',
  '57': 'cent',
  '58': 'dz',
  '59': 'u',
  '99': 'otro',
};

export const convertToShortNames = (unitCode: string): string => {
  return unitShortNames[unitCode] || unitCode;
};