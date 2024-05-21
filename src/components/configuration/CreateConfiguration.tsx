import { ChangeEvent, useContext, useRef, useState } from "react";
import { toast } from "sonner";
import { Image as NextImage, Button, Input } from "@nextui-org/react";
import { useConfigurationStore } from "../../store/perzonalitation.store";
import { ICreacteConfiguaration } from "../../types/configuration.types";
import DefaultImage from "../../assets/react.svg";
import { ThemeContext } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/auth.store";
import compressImage from 'browser-image-compression';

function CreateConfiguration() {
  const { OnCreateConfiguration } = useConfigurationStore();
  const [selectedImage, setSelectedImage] = useState(DefaultImage);
  const { theme } = useContext(ThemeContext);
  const { user } = useAuthStore();

  const [formData, setFormData] = useState<ICreacteConfiguaration>({
    name: "",
    themeId: 1,
    transmitterId: user?.employee?.branch?.transmitterId || 0,
    file: null,
  });

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        console.log('Original file:', file);
        const compressedImage = await compressImage(file, {
          maxSizeMB: 0.5, // Reducir tamaño máximo en MB
          maxWidthOrHeight: 800, // Ajustar las dimensiones máximas
          useWebWorker: true, 
          maxIteration: 10, // Aumentar las iteraciones para mejorar la compresión
          initialQuality: 0.7 // Fijar la calidad inicial (de 0 a 1)
        });
        const convertedFile = new File([compressedImage], file.name, {
          type: compressedImage.type,
          lastModified: Date.now(),
        });

        console.log('Compressed image:', compressedImage);
        const compressedImageUrl = URL.createObjectURL(convertedFile);
        console.log('Compressed image URL:', compressedImageUrl);
        setSelectedImage(compressedImageUrl); 

        setFormData((prevData) => ({
          ...prevData,
          file: convertedFile, 
        }));
        console.log('Updated formData:', formData);

      } catch (error) {
        console.error("Error compressing image:", error);
        toast.error("Error al comprimir la imagen");
      }
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
    await new Promise(resolve => setTimeout(resolve, 0));

    try {
      console.log('Saving formData:', formData);
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
      <NextImage
        src={selectedImage}
        alt="Cargando..."
        fallbackSrc={DefaultImage}
        className="h-720 w-72 rounded-lg object-cover"
      />
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
          value={formData.name}
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
        onClick={() => handleSave(formData)}
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
