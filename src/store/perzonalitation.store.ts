import { create } from 'zustand';
import { toast } from 'sonner';

import { IConfiguration, ICreacteConfiguaration } from '../types/configuration.types';
import {
  create_configuration,
  get_by_transmitter,
  update_configuration_name,
} from '../services/configuration.service';
import { messages } from '../utils/constants';

import { IConfigurationStore } from './types/perzonalitation.types.store';

export const useConfigurationStore = create<IConfigurationStore>((set, get) => ({
  personalization: [],
  config: {} as IConfiguration,
  OnCreateConfiguration: (payload: ICreacteConfiguaration) => {
    create_configuration(payload)
      .then(() => {
        window.location.reload();
        get().GetConfigurationByTransmitter(get().config.transmitterId);
        toast.success('Personalización guardada');
      })
      .catch(() => {
        toast.info('Debes de seleccionar un tema para la configuración');
      });
  },

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
        toast.error('No se encontró información de personalización');
      }
    } catch (error) {
      set((state) => ({ ...state, config: {} as IConfiguration }));
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
