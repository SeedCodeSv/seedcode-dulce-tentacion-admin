import React, { useContext } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { ThemeContext } from "../hooks/useTheme";
import { Box, ChevronDown, Home } from "lucide-react";
// import LOGO from "../assets/react.svg"

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const { theme } = useContext(ThemeContext);

  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  return (
    <Navbar
      classNames={{ base: "w-screen", wrapper: "w-screen max-w-[100vw]" }}
      onMenuOpenChange={setIsMenuOpen}
      shouldHideOnScroll
      isBordered
      isBlurred
      style={{
        backgroundColor: theme.colors.dark,
        color: theme.colors.primary,
      }}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className=""
        />
        <NavbarBrand>
          {/* < /> */}
          <p className="font-bold text-inherit">ACME</p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        <NavbarMenuItem>
          <div className="grid grid-cols-5 gap-8">
            <div className="flex text-xl font-semibold">
              <Home />
              <span className="ml-3">Inicio</span>
            </div>
            <div>
              <Dropdown>
                <NavbarItem>
                  <DropdownTrigger>
                    <Button
                      disableRipple
                      className="p-0 bg-transparent data-[hover=true]:bg-transparent text-xl font-semibold"
                      endContent={<ChevronDown />}
                      radius="sm"
                      variant="light"
                    >
                      <Box /> Features
                    </Button>
                  </DropdownTrigger>
                </NavbarItem>
                <DropdownMenu
                  aria-label="ACME features"
                  className="w-[340px]"
                  itemClasses={{
                    base: "gap-4",
                  }}
                >
                  <DropdownItem
                    key="autoscaling"
                    description="ACME scales apps to meet user demand, automagically, based on load."
                    startContent={<Home />}
                  >
                    Productos
                  </DropdownItem>
                  <DropdownItem
                    key="usage_metrics"
                    description="Real-time metrics to debug issues. Slow query added? We’ll show you exactly where."
                    startContent={<Home />}
                  >
                    Categorias
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
