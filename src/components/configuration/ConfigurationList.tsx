import { useContext, useEffect, useRef, useState } from "react";
import { Card, useDisclosure } from "@nextui-org/react";
import { useThemeStore } from "../../store/theme.store";
import { Theme, ThemeContext } from "../../hooks/useTheme";
import { Check } from "lucide-react";
import AddButton from "../global/AddButton";
import ModalGlobal from "../global/ModalGlobal";
import CreateConfiguration from "./CreateConfiguration";
import CreateTheme from "./CreateTheme";
import { useConfigurationStore } from "../../store/perzonalitation.store";
import { Avatar } from "@nextui-org/react";
import { CardHeader, CardFooter, Divider } from "@nextui-org/react";
import DefaultImage from "../../assets/react.svg";
import { useAuthStore } from "../../store/auth.store";
import UpdateFile from "./UpdateFile";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import UpdateConfigurationName from "./UpdateConfigurationName";
import { Button } from "@nextui-org/react";
import { Image } from 'primereact/image';

function ConfigurationList() {
  const { getPaginatedThemes, themes } = useThemeStore();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [logoId, setLogoId] = useState(0);

  const { personalization, GetConfigurationByTransmitter } =
    useConfigurationStore();
  const { user } = useAuthStore();
  const tramsiter = user?.employee?.branch?.transmitterId;

  useEffect(() => {
    GetConfigurationByTransmitter(tramsiter || 0);
    getPaginatedThemes(1);
  }, []);

  const reloadData = () => {
    GetConfigurationByTransmitter(tramsiter || 0);
  };

  const modalAdd = useDisclosure();
  const addLogo = useDisclosure();
  const UpdateImgModal = useDisclosure();
  const updateName = useDisclosure();

  return (
    <>
      <div className="grid grid-cols-2 gap-0 bg-gray-50 dark:bg-gray-800 h-full w-full">
        <div className="p-4 ">
          <div className="flex items-end justify-between gap-10 mt lg:justify-end mt-5 mr-5">
            <AddButton onClick={() => modalAdd.onOpen()} />
          </div>
          <div className="p-5 bg-gray-50 dark:bg-gray-800">
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
        <div className="p-4 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-end justify-between gap-10 mt lg:justify-end mt-5 mr-5">
            {personalization.length === 0 && (
              <AddButton onClick={() => addLogo.onOpen()} />
            )}
            {personalization.length > 0 &&
              personalization.map((item) => (
                <AddButton
                  key={item.id}
                  onClick={() => {
                    UpdateImgModal.onOpen();
                    setLogoId(item.id || 0);
                  }}
                />
              ))}
          </div>

          <div className="flex justify-center p-5 bg-gray-50 dark:bg-gray-800">
            <div className="flex flex-wrap justify-center bg-gray-50 dark:bg-gray-800">
              {personalization.length === 0 ? (
                <span>no ay logo ni nombre...</span>
                // <Card className="hover:shadow-xl hover:border border border-gray-400 hover:border-blue-400 w-72 h-56 m-4">
                //   <CardHeader className="flex gap-3">
                //     <div className="flex items-center justify-center w-full">
                //       <Avatar
                //         src={DefaultImage}
                //         className="w-36 h-36 text-large"
                //       />
                //     </div>
                //   </CardHeader>
                //   <Divider />
                //   <CardFooter className="flex justify-between">
                //     <div className="w-full text-center">
                //       <p>Seed code ERP</p>
                //     </div>
                //   </CardFooter>
                // </Card>
              ) : (
                <DataTable value={personalization}>
                  <Column
                    field="logo"
                    header="Logo"
                    body={(rowData) => (
                      <Image
                        preview
                        src={rowData.logo}
                        alt={rowData.name}
                        style={{ width: "100px" }}
                      />
                    )}
                  />
                  <Column field="name" header="Nombre" />
                  <Column
                    header="Actualizar Nombre"
                    body={(rowData) => (
                      <>
                        <Button onClick={() => updateName.onOpen()}>
                          Actualizar
                        </Button>
                        <ModalGlobal
                          isOpen={updateName.isOpen}
                          onClose={updateName.onClose}
                          title="Actualizar nombre"
                          size="w-full lg:w-[300px]"
                        >
                          <UpdateConfigurationName
                            id={rowData.id || 0}
                            reloadData={reloadData}
                            onClose={updateName.onClose}
                          />
                        </ModalGlobal>
                      </>
                    )}
                  />
                </DataTable>
              )}
            </div>
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

      <ModalGlobal
        isOpen={UpdateImgModal.isOpen}
        onClose={UpdateImgModal.onClose}
        title="Actualizar logo"
        size="w-full lg:w-[600px]"
      >
        <UpdateFile perzonalitationId={logoId} />
      </ModalGlobal>
    </>
  );
}

export default ConfigurationList;
