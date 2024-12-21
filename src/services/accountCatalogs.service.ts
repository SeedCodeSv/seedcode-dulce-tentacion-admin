import { get_token } from '@/storage/localStorage';
import { AccountCatalogPayload, IGetAccountCatalog, IGetAccountCatalogUpdate } from '@/types/accountCatalogs.types';
import { API_URL } from '@/utils/constants';
import axios from 'axios';


export const get_account_catalogs_paginated = (
    name = '',
    code = '',
) => {
    const token = get_token() ?? '';
    return axios.get<IGetAccountCatalog>(
        `${API_URL}/account-catalogs?name=${name}&code=${code}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};


export const post_account_catalog = (payload: AccountCatalogPayload) => {
    const token = get_token() ?? '';
    return axios.post<{ ok: boolean }>(API_URL + '/account-catalogs', payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};


export const account_catalog_by_id = (id: number) => {
    return axios.get<IGetAccountCatalog>(API_URL + `/account-catalogs/${id}`);
}

export const get_catalog_by_id = (id: number) => {
    return axios.get<IGetAccountCatalogUpdate>(API_URL + `/account-catalogs/${id}`);
}



