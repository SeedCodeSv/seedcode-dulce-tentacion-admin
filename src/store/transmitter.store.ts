import { create } from 'zustand';
import { transmitterStore } from './types/transmitter.store.types';
import { get_transmitterId } from '../services/transmitter.service';
import { ITransmitter } from '../types/transmitter.types';
export const useTransmitterStore = create<transmitterStore>((set) => ({
  transmitter: {} as ITransmitter,

  gettransmitter() {
    get_transmitterId()
      .then(({ data }) => {
        set((state) => ({ ...state, transmitter: data.transmitter }));
      })
      .catch(() => {
        set((state) => ({ ...state, transmitter: {} as ITransmitter }));
      });
  },
}));
