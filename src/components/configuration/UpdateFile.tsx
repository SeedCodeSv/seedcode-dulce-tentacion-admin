import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { API_URL } from '../../utils/constants';
import { toast } from 'sonner';
import DefaultImage from '../../assets/react.svg';
import { useConfigurationStore } from '../../store/perzonalitation.store';
import { useAuthStore } from '../../store/auth.store';
import compressImage from 'browser-image-compression';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

interface Props {
  perzonalitationId: number;
}

function UpdateFile(props: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { personalization, GetConfigurationByTransmitter } = useConfigurationStore();
  const { user } = useAuthStore();
  const tramsiter =
    user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0;

  useEffect(() => {
    GetConfigurationByTransmitter(tramsiter || 0);
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      if (files[0].type !== 'image/png') {
        toast.error('Solo se permiten imágenes en formato .png');
        return;
      }

      setLoading(true);
      try {
        const file = files[0];
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
        setSelectedFile(convertedFile);
      } catch {
        toast.error('Error al comprimir la imagen');
      } finally {
        setLoading(false);
      }
    } else {
      setSelectedFile(null);
      setSelectedImage(null);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        await axios.patch(
          `${API_URL}/personalization/change-image/${props.perzonalitationId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        toast.success('Imagen actualizada con éxito');
        location.reload();
      } catch (error) {
        toast.error('Error al actualizar la imagen');
      }
    } else {
      toast.error('No se seleccionó un archivo');
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const personalizationLogo = personalization?.find((config) => config.logo)?.logo;

  return (
    <>
      <div className="p-4">
        <div className="flex flex-col items-center justify-center m-4 2xl">
          <img
            src={
              selectedImage || personalizationLogo
                ? selectedImage || personalizationLogo
                : DefaultImage
            }
            alt="Cargando..."
            className="h-720 w-72 rounded-lg object-cover"
          />
          <div className="mt-2">
            <label htmlFor="fileInput">
              <ButtonUi
                className="text-white font-semibold px-5"
                onPress={handleButtonClick}
                theme={Colors.Primary}
                disabled={loading}
              >
                {loading ? 'Cargando...' : 'Selecciona un archivo'}
              </ButtonUi>
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
        </div>

        <div className="mt-5">
          <ButtonUi
            className="font-semibold w-full mt-4 text-sm text-white shadow-lg"
            theme={Colors.Success}
            onPress={handleUpload}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </ButtonUi>
        </div>
      </div>
    </>
  );
}

export default UpdateFile;
