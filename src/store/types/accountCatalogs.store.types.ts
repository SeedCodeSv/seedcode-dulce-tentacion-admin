import { AccountCatalog, AccountCatalogPayload, IGetAccountCatalog } from "@/types/accountCatalogs.types";

export interface accountCatalogsStore {
    account_catalog: AccountCatalog[];
    loading: boolean;
    account_catalog_pagination: IGetAccountCatalog;
    getAccountCatalogs: (
        page: number,
        limit: number,
    ) => void;
    postAccountCatalog: (payload: AccountCatalogPayload) => Promise<boolean>;

}
