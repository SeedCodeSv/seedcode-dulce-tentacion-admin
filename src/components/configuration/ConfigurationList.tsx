import { useContext, useEffect, useState } from "react";
import { ThemePayload } from "../../types/themes.types";
import { defaultTheme } from "../../utils/constants";
import { ColorPicker } from "primereact/colorpicker";
import { save_theme } from "../../services/theme.service";
import { toast } from "sonner";
import {
  Card,
  Select,
  SelectItem,
  Button as NButton,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import { useThemeStore } from "../../store/theme.store";
import { Theme, ThemeContext } from "../../hooks/useTheme";
import Button from "../Button";
import { Check } from "lucide-react";
import AddButton from "../global/AddButton";
import ModalGlobal from "../global/ModalGlobal";
import CreateConfiguration from "./CreateConfiguration";

function ConfigurationList() {
  const [color, setColor] = useState(defaultTheme);
  const { getPaginatedThemes, themes } = useThemeStore();
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    getPaginatedThemes(1);
  }, []);

  const modalAdd = useDisclosure();
  const addLogo = useDisclosure();

  const handleSave = () => {
    if (color.context) {
      const payload: ThemePayload = {
        name: color.name,
        context: color.context as "light" | "dark",
        colors: [
          {
            name: "danger",
            color: color.colors.danger,
          },
          {
            name: "dark",
            color: color.colors.dark,
          },
          {
            name: "primary",
            color: color.colors.primary,
          },
          {
            name: "secondary",
            color: color.colors.secondary,
          },
          {
            name: "third",
            color: color.colors.third,
          },
          {
            name: "warning",
            color: color.colors.warning,
          },
        ],
      };

      save_theme(payload)
        .then(() => {
          toast.success("Se guardo el tema");
          location.reload();
        })
        .catch(() => {
          toast.error("Error al guardar el tema");
        });
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-0">
        <div className="p-4">
          <div className="flex items-end justify-between gap-10 mt lg:justify-end mt-5 mr-5">
            <AddButton onClick={() => modalAdd.onOpen()} />
          </div>
          <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {themes.map((themeS, index) => (
                <Card
                  key={index}
                  className="grid w-full grid-cols-6 border shadow"
                  isPressable
                  onClick={() => toggleTheme(themeS as Theme)}
                >
                  {/* <h1>{themeS.name}</h1> */}
                  <div className="absolute top-5 right-5">
                    {themeS.name === theme.name && (
                      <Check size={30} color="#fff" />
                    )}
                  </div>
                  <span
                    className="w-full h-44"
                    style={{ backgroundColor: themeS.colors.danger }}
                  ></span>
                  <span
                    className="w-full h-44"
                    style={{ backgroundColor: themeS.colors.warning }}
                  ></span>
                  <span
                    className="w-full h-44"
                    style={{ backgroundColor: themeS.colors.primary }}
                  ></span>
                  <span
                    className="w-full h-44"
                    style={{ backgroundColor: themeS.colors.secondary }}
                  ></span>
                  <span
                    className="w-full h-44"
                    style={{ backgroundColor: themeS.colors.third }}
                  ></span>
                  <span
                    className="w-full h-44"
                    style={{ backgroundColor: themeS.colors.dark }}
                  ></span>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-end justify-between gap-10 mt lg:justify-end mt-5 mr-5">
            <AddButton onClick={() => addLogo.onOpen()} />
          </div>
        </div>
      </div>

      <ModalGlobal
        isOpen={modalAdd.isOpen}
        onClose={modalAdd.onClose}
        title="Agregar tema"
        size="w-full lg:w-[600px]"
      >
        <div className="ml-5">
          <div className="ml-28">
            <ColorPicker
              format="hex"
              pt={{
                input: () => {
                  return {
                    className: "!h-44 !w-12",
                  };
                },
              }}
              value={color.colors.danger}
              onChange={(e) => {
                setColor({
                  ...color,
                  colors: {
                    ...color.colors,
                    danger: ("#" + e.value) as string,
                  },
                });
              }}
            />
            <ColorPicker
              format="hex"
              pt={{
                input: () => {
                  return {
                    className: "!h-44 !w-12",
                  };
                },
              }}
              value={color.colors.dark}
              onChange={(e) => {
                setColor({
                  ...color,
                  colors: {
                    ...color.colors,
                    dark: ("#" + e.value) as string,
                  },
                });
              }}
            />
            <ColorPicker
              format="hex"
              pt={{
                input: () => {
                  return {
                    className: "!h-44 !w-12",
                  };
                },
              }}
              value={color.colors.primary}
              onChange={(e) => {
                setColor({
                  ...color,
                  colors: {
                    ...color.colors,
                    primary: ("#" + e.value) as string,
                  },
                });
              }}
            />
            <ColorPicker
              format="hex"
              pt={{
                input: () => {
                  return {
                    className: "!h-44 !w-12",
                  };
                },
              }}
              value={color.colors.secondary}
              onChange={(e) => {
                setColor({
                  ...color,
                  colors: {
                    ...color.colors,
                    secondary: ("#" + e.value) as string,
                  },
                });
              }}
            />
            <ColorPicker
              format="hex"
              pt={{
                input: () => {
                  return {
                    className: "!h-44 !w-12",
                  };
                },
              }}
              value={color.colors.third}
              onChange={(e) => {
                setColor({
                  ...color,
                  colors: {
                    ...color.colors,
                    third: ("#" + e.value) as string,
                  },
                });
              }}
            />
            <ColorPicker
              format="hex"
              pt={{
                input: () => {
                  return {
                    className: "!h-44 !w-12",
                  };
                },
              }}
              value={color.colors.warning}
              onChange={(e) => {
                setColor({
                  ...color,
                  colors: {
                    ...color.colors,
                    warning: ("#" + e.value) as string,
                  },
                });
              }}
            />
          </div>
          <div className="flex gap-5 mt-5">
            <Input
              label="Nombre"
              variant="bordered"
              className="w-full"
              labelPlacement="outside"
              placeholder="Ingrese un nombre"
            //   value={color.name}
              onChange={(e) => {
                setColor({ ...color, name: e.target.value });
              }}
            />
          </div>
          <div className="flex gap-5 mt-5">
            <Select
              label="Tema"
              placeholder="Seleccione un tema"
              labelPlacement="outside"
              variant="bordered"
              className="w-full"
              value={color.context}
              onChange={(e) => {
                setColor({ ...color, context: e.target.value });
              }}
            >
              <SelectItem value={"light"} key={"light"}>
                Claro
              </SelectItem>
              <SelectItem value={"dark"} key={"dark"}>
                Oscuro
              </SelectItem>
            </Select>
          </div>
          <div className="flex gap-5 mt-10">
            <Button theme={color as Theme} />
          </div>
          <div className="mt-10">
            <NButton
              size="lg"
              className="w-full mt-4 text-sm font-semibold"
              onClick={handleSave}
              style={{
                backgroundColor: theme.colors.third,
                color: theme.colors.primary,
              }}
            >
              Guardar
            </NButton>
          </div>
        </div>
      </ModalGlobal>

      <ModalGlobal
        isOpen={addLogo.isOpen}
        onClose={addLogo.onClose}
        title="Cambiar logo y nombre"
        size="w-full lg:w-[600px]"
      >
        <CreateConfiguration />
      </ModalGlobal>
    </>
  );
}

export default ConfigurationList;
