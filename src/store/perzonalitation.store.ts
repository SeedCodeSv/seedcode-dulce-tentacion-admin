import { create } from "zustand";
import { IConfigurationStore } from "./types/perzonalitation.types.store";
import {
  IConfiguration,
  IGetConfiguration,
} from "../types/configuration.types";
import {
  create_configuration,
  get_by_transmitter,
  update_configuration_name,
} from "../services/configuration.service";
import { toast } from "sonner";
import { messages } from "../utils/constants";

export const useConfigurationStore = create<IConfigurationStore>((set) => ({
  personalization: [],
  config: {} as IConfiguration,
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

<<<<<<< HEAD
  async GetConfigurationByTransmitter(id: number): Promise<void> {
    try {
      const { data } = await get_by_transmitter(id);
      if (data.personalization) {
        const personalizationArray = Array.isArray(data.personalization)
          ? data.personalization
          : [data.personalization];
        set({
          personalization: personalizationArray,
        });
      } else {
        toast.error("No se encontró información de personalización");
=======
    async GetConfigurationByTransmitter(id: number): Promise<void> {
      try {
        const { data } = await get_by_transmitter(id);
        if (data.personalization) {
          const personalizationArray = Array.isArray(data.personalization) ? data.personalization : [data.personalization];
          set({
            personalization: personalizationArray,
          });
        } else {
          console.log("No se encontró información de personalización");
        }
      } catch (error) {
        console.log(error + "Ocurrió un error al obtener los datos de personalización")
>>>>>>> 50d0bf7da37c26dfc44ff92039d021c7f22f56ba
      }
    } catch (error) {
      console.log(
        error + "Ocurrió un error al obtener los datos de personalización"
      );
    }
  },
  UpdateConfigurationName(payload, id) {
    return update_configuration_name(payload, id)
      .then((res) => {
        toast.success(messages.success);
        return res.data.ok;
      })
      .catch(() => {
        toast.warning(messages.error);
        return false;
      });
  },
  GetConfiguration(id) {
    get_by_transmitter(id)
      .then(({ data }) => {
        set((state) => ({ ...state, config: data.personalization }));
      })
      .catch(() => {
        set((state) => ({ ...state, config: {} as IConfiguration }));
      });
  },
}));
