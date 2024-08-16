import { SidebarLinkGroupProps } from '@/types/view.types';

const SidebarLinkGroup = ({
  children,
  activeCondition,
  isOpen,
  onGroupClick,
}: SidebarLinkGroupProps) => {
  const handleClick = () => {
    onGroupClick(); 
  };

  return (
    <li>
      {children(handleClick, isOpen || activeCondition)}
    </li>
  );
};

export default SidebarLinkGroup;
