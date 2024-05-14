import { create } from "zustand";
import { IContingenciaStore } from "./types/contingencia_store.types";

export const useContigenciaStore = create<IContingenciaStore>()