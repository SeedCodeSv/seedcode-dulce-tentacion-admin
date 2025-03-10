import { ElementType, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useViewsStore } from '../../store/views.store';
import { ThemeContext } from '@/hooks/useTheme';
import { hexToRgba } from '@/layout/utils';

export interface SidebarNavLinkProps {
  viewName: string;
  to: string;
  icon: ElementType;
  label: string;
}

const SidebarNavLink = ({ viewName, to, icon: Icon, label }: SidebarNavLinkProps) => {
  const { viewasAction } = useViewsStore();

  const isActive = viewasAction.some((r) => r.view.name === viewName);

  const { theme, context } = useContext(ThemeContext);

  return isActive ? (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        backgroundColor: isActive
          ? hexToRgba(theme.colors[context].menu.textColor, 0.3)
          : theme.colors[context].menu.background,
        color: theme.colors[context].menu.textColor,
      })}
      className={`group relative flex items-center gap-2.5 font-normal rounded-sm px-3 duration-300 ease-in-out dark:hover:bg-gray-70`}
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
