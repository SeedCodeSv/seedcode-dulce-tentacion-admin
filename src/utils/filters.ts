import { Color, Theme } from "../hooks/useTheme";
import { RoleViewAction } from "../types/actions_rol.types";

export const is_admin = (rol: string) => {
  const patron = /administrador/i;
  return !patron.test(rol);
};
export const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();


export function formatThemeData(themesData: any[]): Theme[] {
  return themesData.map(theme => ({
    name: theme.name,
    context: theme.context,
    colors: theme.colors.reduce((acc: any, color: any) => {
      acc[color.name as keyof Color] = color.color;
      return acc;
    }, {} as Color)
  }));
}

export const filterActions = (name: string, actions: RoleViewAction) => {
  const actions_return = actions.view.find((vi) => vi.name === name);

  return actions_return;
}