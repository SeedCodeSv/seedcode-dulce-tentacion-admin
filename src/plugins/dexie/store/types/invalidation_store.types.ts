import { ISignInvalidationData } from "../../../../types/DTE/invalidation.types";

export interface IInvalidationStore {
  isLoading: boolean,
  isError: boolean,
  errorMessage: string,
  OnCreateInvalidation: (invalidationData: ISignInvalidationData) => Promise<void>,
}
