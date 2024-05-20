import { ChangeEvent, useContext, useRef, useState } from "react";
import { toast } from "sonner";
import { Button, Input } from "@nextui-org/react";
import { useConfigurationStore } from "../../store/perzonalitation.store";
import { ICreacteConfiguaration } from "../../types/configuration.types";
import DefaultImage from "../../assets/react.svg";
import { ThemeContext } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";
import { Cropper, CropperRef } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import "./style.scss";

function CreateConfiguration() {
  const { OnCreateConfiguration } = useConfigurationStore();
  const [selectedImage, setSelectedImage] = useState(DefaultImage);
  const { theme } = useContext(ThemeContext);
  const { user } = useAuthStore();

  const [formData, setFormData] = useState<ICreacteConfiguaration>({
    name: "",
    themeId: 1,
    transmitterId: user?.employee?.branch?.transmitterId || 0,
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setFormData((prevData) => ({
        ...prevData,
        file,
      }));
    } else {
      setSelectedImage(DefaultImage);
      setFormData((prevData) => ({
        ...prevData,
        file: null,
      }));
    }
  };

  const cropperRef = useRef<CropperRef>(null);
  const [fileSelected, setFileSelected] = useState<File>(
    new File([DefaultImage], "carousel-1.png", { type: "image/png" })
  );

  const onCrop = () => {
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
          const resizedImageUrl = resizedCanvas.toDataURL("image/jpeg");
          setSelectedImage(resizedImageUrl);
          resizedCanvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], "cropped_image.jpg", {
                type: "image/jpeg",
              });
              setFileSelected(file);
            } else {
              console.error("No se pudo convertir la imagen recortada en un objeto Blob.");
            }
          }, "image/jpeg");
        };
      } else {
        console.error("El objeto canvas es nulo.");
      }
    }
  };

  const handleSave = async (values: ICreacteConfiguaration) => {
    if (!formData.file) {
      const defaultImageFile = await fetch(DefaultImage)
        .then((res) => res.blob())
        .then((blob) => new File([blob], "default.png", { type: "image/png" }));

      setFormData((prevData) => ({
        ...prevData,
        file: defaultImageFile,
      }));

      setSelectedImage(DefaultImage);
    }

    try {
      await OnCreateConfiguration(values);
      toast.success("Personalización guardada");
      location.reload();
    } catch (error) {
      toast.error("Ocurrió un error al guardar");
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center m-4 2xl:mt-10">
      <div className="example">
        <div className="example__cropper-wrapper">
          <Cropper
            ref={cropperRef}
            className="example__cropper"
            backgroundClassName="example__cropper-background"
            src={selectedImage}
            aspectRatio={() => 1} // Usar una función que devuelva el ratio
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
      <div className="mt-2 w-full">
        <Input
          isRequired
          type="text"
          name="name"
          variant="bordered"
          placeholder="Nombre"
          defaultValue={formData.name}
          onChange={(event) =>
            setFormData({ ...formData, name: event.target.value })
          }
          label="Ingrese el nombre"
        />
      </div>
      <Button
        size="lg"
        color="primary"
        className="font-semibold w-full mt-4 text-sm text-white shadow-lg"
        onClick={() => {
          handleSave(formData);
        }}
        style={{
          backgroundColor: theme.colors.third,
          color: theme.colors.primary,
        }}
      >
        Guardar
      </Button>
    </div>
  );
}

export default CreateConfiguration;
