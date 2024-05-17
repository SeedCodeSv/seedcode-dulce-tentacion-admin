import { create } from "zustand";
import { IConfigurationStore } from "./types/perzonalitation.types.store";
import { IGetConfiguration } from "../types/configuration.types";
import { create_configuration, get_by_transmitter } from "../services/configuration.service";
import { toast } from "sonner";
import { get_personalization } from "../storage/localStorage";

export const useConfigurationStore = create<IConfigurationStore>(
  (set, get) => ({
    personalization: [],
    logo_name: get_personalization(),
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
      if (!get().logo_name.logo) {
        try {
          const { data } = await get_by_transmitter(id);
          if (data.personalization) {

            localStorage.setItem(
              "personalization",
              JSON.stringify({
                name: data.personalization.name,
                logo: data.personalization.logo
              }))

            set({
              personalization: [data.personalization],
            });
          } else {
            toast.error("No se encontró información de personalización");
          }
        } catch (error) {
          toast.error(
            "Ocurrió un error al obtener la información de personalización"
          );
        }
      }
    }

  })


);
