import { get_token } from '@/storage/localStorage';
import { IGetAccountCatalog } from '@/types/accountCatalogs.types';
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



