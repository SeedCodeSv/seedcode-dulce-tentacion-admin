import { ITransmitter } from '../../types/transmitter.types';

export interface transmitterStore {
  transmitter: ITransmitter;
  gettransmitter: () => void;
  getTransmitter: (id: number) => void;
}
