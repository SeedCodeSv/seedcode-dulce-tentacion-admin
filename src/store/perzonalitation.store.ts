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

    async GetConfigurationByTransmitter(id: number): Promise<void> {
      try {
        const { data } = await get_by_transmitter(id);
        if (data.personalization) {
          set({
            personalization: [data.personalization],
          });
        } else {
          toast.error("No se encontró información de personalización");
        }
      } catch (error) {
        console.log(error + "Ocurrió un error al obtener los datos de personalización")
      }
    }
    
  })
    

);
