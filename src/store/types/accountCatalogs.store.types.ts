import { AccountCatalog, AccountCatalogPayload, IGetAccountCatalog } from "@/types/accountCatalogs.types";

export interface accountCatalogsStore {
    account_catalog: AccountCatalog[];
    loading: boolean;
    account_catalog_pagination: IGetAccountCatalog;
    getAccountCatalogs: (
        name : string,
        code: string,
    ) => void;
    postAccountCatalog: (payload: AccountCatalogPayload) => Promise<boolean>;
    getCatalogsDetails: (id: number) => void
    catalog_details: AccountCatalog,
}
