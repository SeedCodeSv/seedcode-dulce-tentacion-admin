import { ChangeEvent, useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Image as NextImage, Input, Checkbox } from "@heroui/react";
import compressImage from 'browser-image-compression';

import { useConfigurationStore } from '../../store/perzonalitation.store';
import { ICreacteConfiguaration } from '../../types/configuration.types';
import DefaultImage from '../../assets/react.svg';
import { useAuthStore } from '../../store/auth.store';

import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

interface Props {
  theme: string;
}

function CreateConfiguration(props: Props) {
  const { OnCreateConfiguration } = useConfigurationStore();
  const [selectedImage, setSelectedImage] = useState(DefaultImage);
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [wantPrint, setWantPrint] = useState(0);

  const [formData, setFormData] = useState<ICreacteConfiguaration>({
    name: '',
    themeName: '',
    transmitterId:
      user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0,
    selectedTemplate: 'template',
    wantPrint: 0,
    file: null,
  });

  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, wantPrint: wantPrint }));
  }, [wantPrint]);

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
          maxSizeMB: 0.8,
          maxWidthOrHeight: 200,
          useWebWorker: true,
          maxIteration: 10,
          initialQuality: 0.85,
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
      await OnCreateConfiguration({ ...formData, themeName: props.theme });
    } catch (error) {
      toast.info('Debes de seleccionar un tema para la configuración');
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="p-4 dark:text-white">
      <div className="flex flex-col items-center justify-center m-4 2xl:mt-10">
        <NextImage
          alt="Cargando..."
          className="h-720 w-72 rounded-lg object-cover"
          fallbackSrc={DefaultImage}
          src={selectedImage}
        />
        <div className="mt-2">
          <label htmlFor="fileInput">
            <ButtonUi
              className="text-white font-semibold px-5"
              disabled={loading}
              theme={Colors.Primary}
              onPress={handleButtonClick}
            >
              {loading ? 'Cargando...' : 'Selecciona un archivo'}
            </ButtonUi>
          </label>
          <input
            ref={fileInputRef}
            accept="image/*"
            id="fileInput"
            style={{ display: 'none' }}
            type="file"
            onChange={handleFileChange}
          />
        </div>
        <div className="mt-2 w-full">
          <Input
            isRequired
            label="Ingrese el nombre"
            name="name"
            placeholder="Nombre"
            type="text"
            value={formData.name}
            variant="bordered"
            onChange={(event) => setFormData({ ...formData, name: event.target.value })}
          />
        </div>
        <div className="mt-2 w-full">
          <Checkbox
            isSelected={wantPrint === 1 ? true : false}
            onChange={(e) => setWantPrint(e.target.checked ? 1 : 0)}
          >
            Habilitar impresión
          </Checkbox>
        </div>
        <ButtonUi
          className="font-semibold w-full mt-4 text-sm text-white shadow-lg"
          color="primary"
          disabled={loading}
          theme={Colors.Primary}
          onPress={handleSave}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </ButtonUi>
      </div>
    </div>
  );
}

export default CreateConfiguration;
