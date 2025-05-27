import * as yup from 'yup';

import { ProductPayloadForm } from '@/types/products.types';
import { typesProduct } from '@/utils/constants';

export const initialValues: ProductPayloadForm = {
  name: '',
  description: 'n/a',
  price: '3.75',
  priceA: 2,
  priceB: 2,
  priceC: 2,
  costoUnitario: '1',
  code: '',
  subCategoryId: 0,
  tipoDeItem: '',
  tipoItem: '',
  uniMedida: '',
  unidaDeMedida: '',
  branch: [],
  stock: 1,
  suppliers: [],
  minimumStock: 1,
  productType: typesProduct[0],
  menu: {
    noDeadline: false,
    addToMenu: false,
    mon: true,
    tue: true,
    wed: true,
    thu: true,
    fri: true,
    sat: true,
    sun: true,
    deDate: '',
    alDate: '',
    deTime: '',
    alTime: '',
  }
};

export const validationSchema = yup.object().shape({
  name: yup.string().required('**El nombre es requerido**'),
  description: yup.string().notRequired(),
  price: yup.number().required('**El precio es requerido**'),
  priceA: yup.number().typeError('**Precio invalido**'),
  priceB: yup.number().typeError('**Precio invalido**'),
  priceC: yup.number().typeError('**Precio invalido**'),
  costoUnitario: yup.number().required('**El costo unitario es requerido**'),
  minimumStock: yup.number(),
  subCategoryId: yup
    .number()
    .required('**Debes seleccionar una sub-categoría**')
    .min(1, '**La sub-categoría es requerida**')
    .typeError('**La sub-categoría es requerida**'),
  tipoItem: yup
    .string()
    .required('**Debes seleccionar el tipo de item**')
    .min(1, '**Debes seleccionar el tipo de item**'),
  uniMedida: yup
    .string()
    .required('**Debes seleccionar la unidad de medida**')
    .min(1, '**Debes seleccionar la unidad de medida**'),
  suppliers: yup
    .array()
    .min(1, '**Seleccione al menos un proveedor**')
    .required('**Seleccione al menos un proveedor**'),
  stock: yup.number().required('**Debes ingresar el stock**').min(0, '**stock invalido**'),
  branch: yup
    .array()
    .min(1, '**Seleccione al menos una sucursal**')
    .required('**Seleccione al menos una sucursal**'),
});

type UnidadDeMedida = {
  id: number;
  codigo: string;
  valores: string;
  isActivated: number;
};

type Categoria =
  | 'longitud'
  | 'area'
  | 'volumen'
  | 'peso'
  | 'energia'
  | 'electrica'
  | 'cantidad'
  | 'otros';

export function filtrarPorCategoria(
  unidadBuscada: string,
  arrayUnidades: UnidadDeMedida[]
): UnidadDeMedida[] {
  const categorias: Record<Categoria, readonly string[]> = {
    longitud: ['metro', 'Yarda', 'milímetro'],
    area: ['kilómetro cuadrado', 'Hectárea', 'metro cuadrado', 'Vara cuadrada'],
    volumen: ['metro cúbico', 'Barril', 'Galón', 'Litro', 'Botella', 'Mililitro'],
    peso: ['Tonelada', 'Quintal', 'Arroba', 'Kilogramo', 'Libra', 'Onza troy', 'Onza', 'Gramo'],
    energia: ['Kilowatt', 'Watt', 'Gigawatt-hora', 'Megawatt-hora', 'Kilowatt-hora', 'Watt-hora'],
    electrica: [
      'Megavoltio-amperio',
      'Kilovoltio-amperio',
      'Voltio-amperio',
      'Kilovoltio',
      'Voltio',
    ],
    cantidad: ['Millar', 'Medio millar', 'Ciento', 'Docena', 'Unidad'],
    otros: ['Otra'],
  } as const;

  const categoriaEncontrada = (Object.keys(categorias) as Categoria[]).find((key) =>
    categorias[key].includes(unidadBuscada)
  );

  if (!categoriaEncontrada) return [];

  return arrayUnidades.filter((unidad) =>
    (categorias[categoriaEncontrada] as readonly string[]).includes(unidad.valores)
  );
}
