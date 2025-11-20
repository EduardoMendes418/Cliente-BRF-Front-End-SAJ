import {
  TOfficeManagementResponsible,
  TOfficeManagementResponsibleFilter,
} from "src/core/models/office-management-responsible";

import { paymentsInstance } from ".";

const BASE_URL = "OfficeManagementResponsible";

const api = {
  getAll(params: TOfficeManagementResponsibleFilter) {
    return paymentsInstance.get(`${BASE_URL}`, { params });
  },
  add(params: TOfficeManagementResponsible) {
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
  edit(params: TOfficeManagementResponsible) {
    return paymentsInstance.put(`${BASE_URL}/${params.id}`, { ...params });
  },
};

export default api;
