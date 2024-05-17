import { ISignInvalidationData } from "../../../../types/DTE/invalidation.types";
import { Sale } from "../../../../types/report_contigence";

export interface IInvalidationStore {
  isLoading: boolean,
  isError: boolean,
  errorMessage: string,
  sales: Sale[],
  OnCreateInvalidation: ( id: number,invalidationData: ISignInvalidationData) => Promise<void>,
  OnGetRecentSales: (id: number) => Promise<void>
}
