import { create } from "zustand";
import { IConfigurationStore } from "./types/perzonalitation.types.store";
import { IConfiguration, IGetConfiguration } from "../types/configuration.types";
import { create_configuration, get_by_transmitter } from "../services/configuration.service";
import { toast } from "sonner";

export const useConfigurationStore = create<IConfigurationStore>(
  (set, get) => ({
    personalization: [],
    OnCreateConfiguration: (payload: IGetConfiguration) => {
      create_configuration(payload)
        .then(() => {
          toast.success("Personalización guardada");
        })
        .catch((error: any) => {
          console.error("Error al crear:", error);
          toast.error("Ocurrió un error al crear");
        });
    },

    async GetConfigurationByTransmitter(id:number ) {
      try {
        const response = await get_by_transmitter(id);
        if (typeof response.data.personalization === 'object') {
          // Convertir el objeto a un array de un solo elemento
          const mappedData: IConfiguration[] = [response.data.personalization];
          set({ personalization: mappedData });
        } else if (Array.isArray(response.data.personalization)) {
          // Utilizar el array directamente
          const mappedData: IConfiguration[] = response.data.personalization.map((item: any) => ({
            logo: item.logo,
            ext: item.ext,
            name: item.name,
            themeId: item.themeId,
            transmitterId: item.transmitterId
          }));
          set({ personalization: mappedData });
        } else {
          set({ personalization: [] });
          toast.error("La respuesta de la API no contiene datos de personalización válidos");
        }
      } catch (error) {
        console.error("Error al obtener la información de personalización:", error);
        set({ personalization: [] });
        toast.error("Ocurrió un error al obtener la información de personalización");
      }
    }
    
    
    
  })
);
