import { ElementType, useContext, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { Lock } from 'lucide-react';

import { ThemeContext } from '@/hooks/useTheme';
import { hexToRgba } from '@/layout/utils';
import { PermissionContext } from '@/hooks/usePermission';

export interface SidebarNavLinkProps {
  viewName: string;
  to: string;
  icon: ElementType;
  label: string;
}

const SidebarNavLink = ({ viewName, to, icon: Icon, label }: SidebarNavLinkProps) => {
  const { roleActions } = useContext(PermissionContext);

  const isActive = useMemo(() => {
    const view = roleActions?.views.find((view) => view.view.name === viewName);

    return !!view;
  }, [roleActions, viewName]);

  const { theme, context } = useContext(ThemeContext);

  return isActive ? (
    <NavLink
      className={`group relative flex items-center gap-2.5 font-normal rounded-sm px-3 duration-300 ease-in-out dark:hover:bg-gray-70`}
      style={({ isActive }) => ({
        backgroundColor: isActive
          ? hexToRgba(theme.colors[context].menu.textColor, 0.3)
          : theme.colors[context].menu.background,
        color: theme.colors[context].menu.textColor,
      })}
      to={to}
    >
      <Icon size={15} />
      {label}
    </NavLink>
  ) : (
    <li className="py-1 text-gray-500 cursor-not-allowed">
      <div className="flex items-center gap-1 rounded-md px-3">
        <Lock size={15} /> {label}
      </div>
    </li>
  );
};

export default SidebarNavLink;
