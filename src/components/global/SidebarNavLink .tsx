import { ElementType } from 'react';
import { NavLink } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useViewsStore } from '../../store/views.store';

export interface SidebarNavLinkProps {
  viewName: string;
  to: string;
  icon: ElementType;
  label: string;
}

const SidebarNavLink = ({ viewName, to, icon: Icon, label }: SidebarNavLinkProps) => {
  const { viewasAction } = useViewsStore();

  const isActive = viewasAction.some((r) => r.view.name === viewName);

  return isActive ? (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group relative flex items-center gap-2.5 font-normal rounded-sm px-3  duration-300 ease-in-out  dark:hover:bg-gray-700 ${
          isActive ? 'text-black font-semibold' : ''
        }`
      }
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
