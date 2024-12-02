import { Employee } from "@/types/employees.types";

export type SetFieldValue = {
    (field: keyof Employee, value: string): void;
}