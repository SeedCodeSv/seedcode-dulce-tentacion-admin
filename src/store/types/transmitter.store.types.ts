import { Transmitter } from '../../types/categories.types';
import { ITransmitter } from '../../types/transmitter.types';

export interface transmitterStore {
  transmitter: ITransmitter;
  gettransmitter: () => void;
}
