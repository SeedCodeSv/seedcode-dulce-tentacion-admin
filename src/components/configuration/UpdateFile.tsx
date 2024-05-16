import axios from "axios";
import React, { useState } from "react";
import { API_URL } from "../../utils/constants";
import { toast } from "sonner";
import { Button } from "@nextui-org/react";

interface Props {
  perzonalitationId: number;
}

function UpdateFile(props: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    } else {
      setSelectedFile(null);
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

  return (
    <div>
      <div className="border-5 w-96 h-96 border-dashed border-gray-300 rounded-md">
        <input type="file" onChange={handleFileChange} className="mt-80" />
      </div>

      <div className="mt-5">
        <Button
          className="bg-orange-500 font-bold text-white xl:px-3 xl:py-2 xl:rounded-md py-2 px-3 rounded-md mr-3"
          size="sm"
          style={{
            backgroundColor: "#0000abed",
            borderColor: "#300F4F",
          }}
          onClick={handleUpload}
        >
          Guardar
        </Button>
      </div>
    </div>
  );
}

export default UpdateFile;
