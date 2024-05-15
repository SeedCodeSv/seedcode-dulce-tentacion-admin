import { create } from "zustand";
import { IConfigurationStore } from "./types/perzonalitation.types.store";
import { IGetConfiguration } from "../types/configuration.types";
import { create_configuration, get_by_transmitter } from "../services/configuration.service";
import { toast } from "sonner";

export const useConfigurationStore = create<IConfigurationStore>(
  (set, get) => ({
    personalization: [],
    get_personalization: [],
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
      await get_by_transmitter(id)
      .then(({ data }) => {
        set({ personalization: data.personalization });
      }).catch(() => {
        set({ personalization: [] });
        toast.error("Ocurrió un error al obtener la información")
      })
  }
  })
);
