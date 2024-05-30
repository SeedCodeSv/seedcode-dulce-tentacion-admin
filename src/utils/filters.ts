import { Color, Theme } from '../hooks/useTheme';
import { Theme as ITheme } from '../types/themes.types';
import { RoleViewAction } from '../types/actions_rol.types';
import { IBranchProductOrderQuantity, SupplierProducts } from '../types/branch_products.types';

export const is_admin = (rol: string) => {
  const patron = /administrador/i;
  return !patron.test(rol);
};
export const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export function formatThemeData(themesData: ITheme[]): Theme[] {
  return themesData.map((theme) => ({
    name: theme.name,
    context: theme.context,
    colors: theme.colors.reduce((acc, color) => {
      acc[color.name as keyof Color] = color.color;
      return acc;
    }, {} as Color),
  }));
}

export const filterActions = (name: string, actions: RoleViewAction) => {
  const actions_return = actions.view.find((vi) => vi.name === name);

  return actions_return;
};

export const groupBySupplier = (items: IBranchProductOrderQuantity[]): SupplierProducts[] => {
  const supplierMap = new Map<number, SupplierProducts>();

  items.forEach(item => {
    if (!supplierMap.has(item.supplierId)) {
      supplierMap.set(item.supplierId, {
        supplier: item.supplier,
        products: []
      });
    }
    supplierMap.get(item.supplierId)!.products.push(item);
  });

  return Array.from(supplierMap.values());
};