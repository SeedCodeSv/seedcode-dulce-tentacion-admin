import moment from "moment";
import { toast } from "sonner";

import { RoleViewAction } from "../types/actions_rol.types";

import { IBranchProductOrderQuantity, SupplierProducts } from "@/types/branch_product_order.types";

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
    if (!supplierMap.has(item.supplierId)) {
      supplierMap.set(item.supplierId, {
        supplier: item.supplier!,
        products: [],
      });
    }
    supplierMap.get(item.supplierId)!.products.push(item);
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

export function verifyApplyAnulation(tipoDte: string, date: string) {
  const fechaDTEParseada = moment(date, 'YYYY-MM-DD')

  if (!fechaDTEParseada.isValid()) {
    toast.error('Fecha inválida')

    return false
  }
  const fechaActual = moment()
  const daysDiference = fechaActual.diff(fechaDTEParseada, 'days')

  if (tipoDte === '01') {
    const daysLimit = 90

    if (daysDiference > daysLimit) {
      toast.error('DTE fuera del plazo de disponibilidad (3 meses)')

      return false
    }

    return true
  } else if (tipoDte === '03' || tipoDte === '06' || tipoDte === '05') {
    const daysLimit = 1

    if (daysDiference > daysLimit) {
      toast.error('DTE fuera del plazo de disponibilidad (1 día)')

      return false
    }

    return true
  } else {
    toast.error('Tipo de DTE inválido')

    return false
  }
}