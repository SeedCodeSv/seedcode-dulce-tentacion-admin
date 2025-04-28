import { create } from 'zustand';

import { get_transmitter, get_transmitterId } from '../services/transmitter.service';
import { ITransmitter } from '../types/transmitter.types';

import { transmitterStore } from './types/transmitter.store.types';
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

  getTransmitter(id) {
    get_transmitter(id)
      .then(({data}) => {
        set((state) => ({ ...state, transmitter: data.transmitter }))
      })
      .catch(() => {
        set((state) => ({ ...state, transmitter: {} as ITransmitter }))
      })
  },
}));
