import { RoleViewAction } from "../types/actions_rol.types";
import {
  IBranchProductOrderQuantity,
  SupplierProducts,
} from "../types/branch_products.types";

export const is_admin = (rol: string) => {
  const patron = /administrador/i;

  return !patron.test(rol);
};
export const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export const filterActions = (name: string, actions: RoleViewAction) => {
  const actions_return = actions.view.find((vi) => vi.name === name);

  return actions_return;
};

export const groupBySupplier = (
  items: IBranchProductOrderQuantity[]
): SupplierProducts[] => {
  const supplierMap = new Map<number, SupplierProducts>();

  items.forEach((item) => {
    if (!supplierMap.has(item.supplier?.id)) {
      supplierMap.set(item.supplier.id, {
        supplier: item.supplier,
        products: [],
      });
    }
    supplierMap.get(item.supplier.id)!.products.push(item);
  });

  return Array.from(supplierMap.values());
};

export function calcularPorcentajeDescuento(
  total: number,
  descuento: number
): number {
  const precioOriginal = total + descuento;
  const porcentajeDescuento = (descuento / precioOriginal) * 100;

  return porcentajeDescuento;
}

export function calculateDiscountedTotal(
  price: number,
  discountPercentage: number
): { discountedTotal: number; discountAmount: number } {
  const discountAmount = (price * discountPercentage) / 100;
  const discountedTotal = price - discountAmount;

  return { discountedTotal, discountAmount };
}

export function getRandomColorsArray(): string[] {
  const colors = [
    "#14b8a6",
    "#06b6d4",
    "#0ea5e9",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#f472b6",
    "#f87171",
    "#fca5a5",
    "#fee2e2",
  ];

  return colors;
}

export const validateIfArrayContain = (array: string[], items: string[]) => {
  return array && array.some((item) => items.includes(item));
}

export const validate_pathname = (pathname: string, array_pathnames: string[]) => {
  const validation = array_pathnames.some((item) => pathname.includes(item));

  return validation
}