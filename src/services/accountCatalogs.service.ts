import { get_token } from '@/storage/localStorage';
import { AccountCatalogPayload, IGetAccountCatalog } from '@/types/accountCatalogs.types';
import { API_URL } from '@/utils/constants';
import axios from 'axios';


export const get_account_catalogs_paginated = (
    page = 1,
    limit = 5,
) => {
    const token = get_token() ?? '';
    return axios.get<IGetAccountCatalog>(
        `${API_URL}/account-catalogs?page=${page}&limit=${limit}`,
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


