import { Logs } from "../../types/logs.types";

export interface LogsStore {
    logs: Logs[],
    getLogs: (code: string) => Promise<void>,
}