import { ChangeEvent, useContext, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Image as NextImage, Button, Input } from '@nextui-org/react';
import { useConfigurationStore } from '../../store/perzonalitation.store';
import { ICreacteConfiguaration } from '../../types/configuration.types';
import DefaultImage from '../../assets/react.svg';
import { ThemeContext } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/auth.store';
import compressImage from 'browser-image-compression';

function CreateConfiguration() {
  const { OnCreateConfiguration } = useConfigurationStore();
  const [selectedImage, setSelectedImage] = useState(DefaultImage);
  const { theme } = useContext(ThemeContext);
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<ICreacteConfiguaration>({
    name: '',
    themeId: 1,
    transmitterId: user?.employee?.branch?.transmitterId || 0,
    file: null,
  });

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'image/png') {
        toast.error('Solo se permiten imágenes en formato .png');
        return;
      }

      setLoading(true);
      try {
        const compressedImage = await compressImage(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 500,
          useWebWorker: true,
          maxIteration: 10,
          initialQuality: 0.7,
        });
        const convertedFile = new File([compressedImage], file.name, {
          type: compressedImage.type,
          lastModified: Date.now(),
        });

        const compressedImageUrl = URL.createObjectURL(convertedFile);
        setSelectedImage(compressedImageUrl);

        setFormData((prevData) => ({
          ...prevData,
          file: convertedFile,
        }));
      } catch {
        toast.error('Error al comprimir la imagen');
      } finally {
        setLoading(false);
      }
    } else {
      setSelectedImage(DefaultImage);
      setFormData((prevData) => ({
        ...prevData,
        file: null,
      }));
    }
  };

  const handleSave = async () => {
    if (!formData.file) {
      const defaultImageFile = await fetch(DefaultImage)
        .then((res) => res.blob())
        .then((blob) => new File([blob], 'default.png', { type: 'image/png' }));

      setFormData((prevData) => ({
        ...prevData,
        file: defaultImageFile,
      }));

      setSelectedImage(DefaultImage);
    }

    await new Promise((resolve) => setTimeout(resolve, 0));

    try {
      await OnCreateConfiguration(formData);
      toast.success('Personalización guardada');
      location.reload();
    } catch (error) {
      toast.error('Ocurrió un error al guardar');
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="p-4">
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
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Selecciona un archivo'}
            </Button>
          </label>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            style={{ display: 'none' }}
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
            onChange={(event) => setFormData({ ...formData, name: event.target.value })}
            label="Ingrese el nombre"
          />
        </div>
        <Button
          color="primary"
          className="font-semibold w-full mt-4 text-sm text-white shadow-lg"
          onClick={handleSave}
          style={{
            backgroundColor: theme.colors.third,
            color: theme.colors.primary,
          }}
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </div>
  );
}

export default CreateConfiguration;
