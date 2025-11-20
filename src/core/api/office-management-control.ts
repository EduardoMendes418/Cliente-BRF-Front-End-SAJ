import {
  TOfficeManagementControl,
  TOfficeManagementControlFilter,
} from "src/core/models/office-management-control";

import { paymentsInstance } from ".";

const BASE_URL = "OfficeManagementControl";

const api = {
  getAll(params: TOfficeManagementControlFilter) {
    return paymentsInstance.get(`${BASE_URL}`, { params });
  },
  add(params: TOfficeManagementControl) {
    return paymentsInstance.post(`${BASE_URL}`, {
      ...params,
      isActive: true,
    });
  },
  get(id: number) {
    return paymentsInstance.get(`${BASE_URL}/${id}`);
  },
  delete(id: number) {
    return paymentsInstance.delete(`${BASE_URL}/${id}`);
  },
  edit(params: TOfficeManagementControl) {
    return paymentsInstance.put(`${BASE_URL}/${params.id}`, { ...params });
  },
};

export default api;
