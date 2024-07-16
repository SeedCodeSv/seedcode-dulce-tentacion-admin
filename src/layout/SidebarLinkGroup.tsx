import { SidebarLinkGroupProps } from '@/types/view.types';
import { useState } from 'react';



const SidebarLinkGroup = ({
  children,
  activeCondition,
  isOpen,
  onGroupClick,
}: SidebarLinkGroupProps) => {
  const [open, setOpen] = useState<boolean>(activeCondition);

  const handleClick = () => {
    setOpen(!open);
    onGroupClick(); 
  };

  return <li>{children(handleClick, isOpen)}</li>;
};

export default SidebarLinkGroup;
