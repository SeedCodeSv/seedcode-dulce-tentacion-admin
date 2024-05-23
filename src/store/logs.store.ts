import { create } from 'zustand';
import { LogsStore } from './types/logs.store.types';
import { get_logs } from '../services/logs.service';

export const useLogsStore = create<LogsStore>((set) => ({
  logs: [],
  async getLogs(code) {
    get_logs(code)
      .then((res) => {
        set((state) => ({
          ...state,
          logs: res.data.logs,
        }));
      })
      .catch(() => {
        set((state) => ({
          ...state,
          logs: [],
        }));
      });
  },
}));
