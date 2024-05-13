import { create } from "zustand";
import { IConfigurationStore } from "./types/perzonalitation.types.store";
import { IGetConfiguration } from "../types/configuration.types";
import { create_configuration } from "../services/configuration.service";
import { toast } from "sonner";

export const useConfigurationStore = create<IConfigurationStore>(
  (set, get) => ({
    personalization: [],

    OnCreateConfiguration: (payload: IGetConfiguration) => {
      create_configuration(payload)
        .then(() => {
          toast.success("Se creo con éxito");
        })
        .catch((error: any) => {
          console.error("Error al crear:", error);
          toast.error("Ocurrió un error al crear");
        });
    },
  })
);
