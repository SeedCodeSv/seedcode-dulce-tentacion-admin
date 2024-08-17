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
          viewName={link.viewName}
          to={link.to}
          icon={link.icon}
          label={link.label}
        />
      ))}
    </ul>
  );
};

export default SidebarLinkList;
