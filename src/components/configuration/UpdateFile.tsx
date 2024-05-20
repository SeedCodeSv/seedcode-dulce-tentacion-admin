import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { API_URL } from "../../utils/constants";
import { toast } from "sonner";
import { Button } from "@nextui-org/react";
import DefaultImage from "../../assets/react.svg";
import { useConfigurationStore } from "../../store/perzonalitation.store";
import { useAuthStore } from "../../store/auth.store";
import { ThemeContext } from "../../hooks/useTheme";
import { Cropper, CropperRef } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import "./style.scss";

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

  const cropperRef = useRef<CropperRef>(null);
  const [fileSelected, setFileSelected] = useState<File>(
    new File([DefaultImage], "logo.png", { type: "image/png" })
  );

  const onCrop = async () => {
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCanvas();
      if (canvas) {
        const resizedCanvas = document.createElement("canvas");
        const ctx = resizedCanvas.getContext("2d");
        resizedCanvas.width = 200;
        resizedCanvas.height = 200;

        const img = new Image();
        img.src = canvas.toDataURL();

        img.onload = () => {
          ctx?.drawImage(img, 0, 0, 200, 200);
          const resizedImageUrl = resizedCanvas.toDataURL("image/png");
          setSelectedImage(resizedImageUrl);

          // Convert the resized canvas to a Blob
          resizedCanvas.toBlob((blob) => {
            if (blob) {
              const croppedFile = new File([blob], "cropped_image.png", {
                type: "image/jpeg",
              });
              setFileSelected(croppedFile);
            } else {
              console.error(
                "No se pudo convertir la imagen recortada en un objeto Blob."
              );
            }
          }, "image/png");
        };
      } else {
        console.error("El objeto canvas es nulo.");
      }
    } else {
      console.error("El objeto cropper es nulo.");
    }
  };

  const handleUpload = async () => {
    if (fileSelected) {
      try {
        const formData = new FormData();
        formData.append("file", fileSelected); // Use the cropped image data

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
        location.reload();
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
        <div className="example">
          <div className="example__cropper-wrapper">
            <Cropper
              ref={cropperRef}
              className="example__cropper"
              backgroundClassName="example__cropper-background"
              src={
                selectedImage || personalizationLogo
                  ? selectedImage || personalizationLogo
                  : DefaultImage
              }
              aspectRatio={() => 1}
            />
          </div>
          <div className="example__buttons-wrapper">
            {selectedImage && (
              <button className="example__button" onClick={onCrop}>
                Recortar
              </button>
            )}
          </div>
        </div>
        <div className="mt-2">
          <label htmlFor="fileInput">
            <Button
              className="text-white font-semibold px-5"
              onClick={handleButtonClick}
              style={{
                backgroundColor: theme.colors.dark,
                color: theme.colors.primary,
              }}
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
