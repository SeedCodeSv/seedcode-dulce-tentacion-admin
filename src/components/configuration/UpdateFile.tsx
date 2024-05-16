import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { API_URL } from "../../utils/constants";
import { toast } from "sonner";
import { Button, Image as NextImage } from "@nextui-org/react";
import DefaultImage from "../../assets/react.svg";
import { useConfigurationStore } from "../../store/perzonalitation.store";
import { useThemeStore } from "../../store/theme.store";
import { useAuthStore } from "../../store/auth.store";
import { ThemeContext } from "../../hooks/useTheme";

interface Props {
  perzonalitationId: number;
}

function UpdateFile(props: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { personalization, GetConfigurationByTransmitter } =
    useConfigurationStore();
  const { user } = useAuthStore();
  const tramsiter = user?.employee?.branch?.transmitterId;

  useEffect(() => {
    GetConfigurationByTransmitter(tramsiter || 0);
  }, []);

  const { theme } = useContext(ThemeContext);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setSelectedImage(reader.result as string); // Establecer la imagen seleccionada
        }
      };
      reader.readAsDataURL(files[0]);
    } else {
      setSelectedFile(null);
      setSelectedImage(null); // Limpiar la imagen selecciona
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        await axios.patch(
          `${API_URL}/personalization/change-image/${props.perzonalitationId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Imagen actualizada con exito");
      } catch (error) {
        toast.error("Error al actualizar la imagen: ");
      }
    } else {
      toast.error("No se selecciono un archivo: ");
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const personalizationLogo = personalization?.find(
    (config) => config.logo
  )?.logo;

  return (
    <>
      <div className="flex flex-col items-center justify-center m-4 2xl">
        <img
          src={
            selectedImage || personalizationLogo
              ? selectedImage || personalizationLogo
              : DefaultImage
          }
          alt="Cargando..."
          className="h-720 w-72 rounded-lg object-cover"
        ></img>
        <div className="mt-2">
          <label htmlFor="fileInput">
            <Button
              className="text-white font-semibold px-5"
              onClick={handleButtonClick}
            >
              Selecciona un archivo
            </Button>
          </label>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </div>
      </div>

      <div className="mt-5">
        <Button
          className="font-semibold w-full mt-4 text-sm text-white shadow-lg"
          size="lg"
          style={{
            backgroundColor: theme.colors.third,
            color: theme.colors.primary,
          }}
          onClick={handleUpload}
        >
          Guardar
        </Button>
      </div>
    </>
  );
}

export default UpdateFile;
