import { ChangeEvent, useContext, useRef, useState } from "react";
import { toast } from "sonner";
import { Image as NextImage, Button, Input } from "@nextui-org/react";
import { useConfigurationStore } from "../../store/perzonalitation.store";
import { ICreacteConfiguaration } from "../../types/configuration.types";
import DefaultImage from "../../assets/react.svg";
import { ThemeContext } from "../../hooks/useTheme";

function CreateConfiguration() {
  const { OnCreateConfiguration } = useConfigurationStore();
  const [selectedImage, setSelectedImage] = useState(DefaultImage);

  const { theme } = useContext(ThemeContext);

  const [formData, setFormData] = useState<ICreacteConfiguaration>({
    name: "",
    themeId: 1,
    transmitterId: 1,
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          const convertedFile = new File(
            [blob!],
            Date.now().toString() + ".png",
            { type: "image/png" }
          );
          const convertedImageUrl = URL.createObjectURL(convertedFile);
          setSelectedImage(convertedImageUrl);
          setFormData((prevData) => ({
            ...prevData,
            file: convertedFile,
          }));
        }, "image/png");
      };
    } else {
      setSelectedImage(DefaultImage);
      setFormData((prevData) => ({
        ...prevData,
        file: null,
      }));
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
    <>
      <div className="flex flex-col items-center justify-center m-4 2xl   :mt-10">
        <NextImage
          src={selectedImage}
          alt="Cargando..."
          fallbackSrc={DefaultImage}
          className="h-720 w-72 rounded-lg object-cover"
        ></NextImage>
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
    </>
  );
}

export default CreateConfiguration;
