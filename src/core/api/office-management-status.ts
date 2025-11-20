import {
  TOfficeManagementStatus,
  TOfficeManagementStatusFilters,
} from "src/core/models/office-management-status";

import { paymentsInstance } from ".";

const BASE_URL = "OfficeManagementStatus";

const api = {
  getAll(params: TOfficeManagementStatusFilters) {
    return paymentsInstance.get(`${BASE_URL}`, { params });
  },
  add(params: TOfficeManagementStatus) {
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
  edit(params: TOfficeManagementStatus) {
    return paymentsInstance.put(`${BASE_URL}/${params.id}`, { ...params });
  },
};

export default api;
