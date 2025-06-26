import axios from 'axios';

import { API_URL } from '../utils/constants';
import {
  EmployeePayload,
  GetEmployeeByCode,
  // GetEmployeeContingence,
  GetEmployeeList,
  IGetEmployeesPaginated,
  Person,
} from '../types/employees.types';
import { get_token } from '../storage/localStorage';

export const get_employees_paginated = (
  id: number,
  page: number,
  limit: number,
  firstName: string,
  firstLastName: string,
  branch: string,
  phone: string,
  codeEmployee: string,
  active: number = 1,
  startDate: string,
  endDate: string
) => {
  const token = get_token() ?? '';

  return axios.get<IGetEmployeesPaginated>(
    API_URL +
    `/employees/list-paginated/${id}?page=` +
    page +
    '&limit=' +
    limit +
    '&firstName=' +
    firstName +
    '&firstLastName=' +
    firstLastName +
    '&branch=' +
    branch +
    '&phone=' +
    phone +
    '&code=' +
    codeEmployee +
    '&active=' +
    active +
    '&startDate=' +
    startDate +
    '&endDate=' +
    endDate,

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const save_employee = (payload: EmployeePayload) => {
  const token = get_token() ?? '';

  return axios.post<{ ok: boolean }>(API_URL + '/employees', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const patch_employee = (payload: EmployeePayload, id: number) => {
  const token = get_token() ?? '';

  return axios.patch<{ ok: boolean }>(API_URL + '/employees/' + id, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const delete_employee = (id: number) => {
  const token = get_token() ?? '';

  return axios.delete<{ ok: boolean }>(API_URL + '/employees/' + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_employee_list = () => {
  const token = get_token() ?? '';

  return axios.get<GetEmployeeList>(API_URL + '/employees', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_employee_by_branch = (id: number) => {
  const token = get_token() ?? ''

  return axios.get<GetEmployeeList>(API_URL + '/employees/get-by-branch/' + id, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
export const activate_employee = (id: number) => {
  const token = get_token() ?? '';

  return axios.patch<{ ok: boolean }>(
    API_URL + '/employees/activate/' + id,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const verify_code = (code: string) => {
  const token = get_token() ?? '';

  return axios.get<{ ok: boolean }>(API_URL + '/employees/verify-code?code=' + code, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_birthday_employees = () => {
  const token = get_token() ?? '';

  return axios.get<Person>(API_URL + '/employees/get-birthday-employee', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// export const get_list_employees = () => {
//   const token = get_token() ?? '';
//   return axios.get<GetEmployeeContingence>(API_URL + '/employees', {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   })
// }

export const get_employee_by_code = (code: string) => {
  const token = get_token() ?? '';

  return axios.get<GetEmployeeByCode>(API_URL + `/employees/get-by-code/${code}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};



export const generate_code = (id: number, time: number) => {
  const token = get_token() ?? '';

  return axios.patch<{ ok: boolean; code: string }>(
    `${API_URL}/employees/generate-code/${id}`,
    { time },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

