import { create } from 'zustand';

import { get_logs } from '../services/logs.service';

import { LogsStore } from './types/logs.store.types';

export const useLogsStore = create<LogsStore>((set) => ({
  logs: [],
  async getLogs(code) {
    await get_logs(code)
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
