import { useContext, useEffect, useState } from "react";
import { defaultTheme } from "../../utils/constants";
import {
  Card,
  Button as NButton,
  useDisclosure,
} from "@nextui-org/react";
import { useThemeStore } from "../../store/theme.store";
import { Theme, ThemeContext } from "../../hooks/useTheme";
import { Check } from "lucide-react";
import AddButton from "../global/AddButton";
import ModalGlobal from "../global/ModalGlobal";
import CreateConfiguration from "./CreateConfiguration";
import CreateTheme from "./CreateTheme";

function ConfigurationList() {
  const [color, setColor] = useState(defaultTheme);
  const { getPaginatedThemes, themes } = useThemeStore();
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    getPaginatedThemes(1);
  }, []);

  const modalAdd = useDisclosure();
  const addLogo = useDisclosure();
  //   if (color.context) {
  //     const payload: ThemePayload = {
  //       name: color.name,
  //       context: color.context as "light" | "dark",
  //       colors: [
  //         {
  //           name: "danger",
  //           color: color.colors.danger,
  //         },
  //         {
  //           name: "dark",
  //           color: color.colors.dark,
  //         },
  //         {
  //           name: "primary",
  //           color: color.colors.primary,
  //         },
  //         {
  //           name: "secondary",
  //           color: color.colors.secondary,
  //         },
  //         {
  //           name: "third",
  //           color: color.colors.third,
  //         },
  //         {
  //           name: "warning",
  //           color: color.colors.warning,
  //         },
  //       ],
  //     };

  //     save_theme(payload)
  //       .then(() => {
  //         toast.success("Se guardo el tema");
  //         location.reload();
  //       })
  //       .catch(() => {
  //         toast.error("Error al guardar el tema");
  //       });
  //   }
  // };

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
          <div className="">
            Configuracion
          </div>
        </div>
      </div>

      <ModalGlobal
        isOpen={modalAdd.isOpen}
        onClose={modalAdd.onClose}
        title="Agregar tema"
        size="w-full lg:w-[600px]"
      >
       <CreateTheme />
      </ModalGlobal>

      <ModalGlobal
        isOpen={addLogo.isOpen}
        onClose={addLogo.onClose}
        title="Agregar logo y nombre"
        size="w-full lg:w-[600px]"
      >
        <CreateConfiguration />
      </ModalGlobal>
    </>
  );
}

export default ConfigurationList;
