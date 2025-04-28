import SidebarNavLink, { SidebarNavLinkProps } from './SidebarNavLink ';

interface SidebarLinkListProps {
  links: SidebarNavLinkProps[];
 
}
const SidebarLinkList = ({ links }: SidebarLinkListProps) => {
  return (
    <ul className="mt-1 mb-1 flex flex-col space-y-4 pl-4">
      {links.map((link) => (
        <SidebarNavLink
         
          key={link.viewName}
          icon={link.icon}
          label={link.label}
          to={link.to}
          viewName={link.viewName}
        />
      ))}
    </ul>
  );
};

export default SidebarLinkList;
