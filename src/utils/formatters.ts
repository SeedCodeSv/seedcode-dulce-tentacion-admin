import { ProductSupplier, UpdateSuppliersBranchP } from "@/types/products.types";
import { Supplier } from "@/types/supplier.types";

export const formatDate = (dateString: string | null) => {
  if (!dateString) return '-';

  const date = new Date(dateString);

  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const getUnitLabel = (unitCode: string) => {
  const unitMap: Record<string, string> = {
    '59': 'Unidad',
    '34': 'Kg',
    '36': 'Lbs',
  };

  return unitMap[unitCode] || unitCode;
};

export function formatSuppliers(value: ProductSupplier[] | undefined): UpdateSuppliersBranchP[] {
  if (!value || value.length === 0 && value === undefined) {
    return [];
  }

  return value.map((i) => ({
    id: i?.id ?? 0,
    supplierId: i?.supplier?.id ?? 0,
    branchProductId: i?.branchProduct?.id,
    name:i?.supplier?.nombre ?? '',
    isActive: i?.isActive ?? false,
  }));
}




export const formatFullSupplierList = (
  initialSuppliers: Supplier[],
  selectedSuppliers: Supplier[],
  branchProductId: number
) => {
  return selectedSuppliers.map((supplier) => {
    const existingSupplier = initialSuppliers.find(
      (initial) => initial.id === supplier.id
    );

    if (existingSupplier) {
      return {
        id: existingSupplier.id, 
        supplierId: existingSupplier.id,
        branchProductId,
        isActive: supplier.isActive, 
      };
    }

    return {
      id: 0, 
      supplierId: supplier.id,
      branchProductId,
      isActive: true,
    };
  });
};
