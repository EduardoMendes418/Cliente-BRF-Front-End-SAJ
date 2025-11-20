import {
  TOfficeManagementDocumentType,
  TOfficeManagementDocumentTypeFilter,
} from "src/core/models/office-management-document-type";

import { paymentsInstance } from ".";

const BASE_URL = "OfficeManagementDocument";

const api = {
  getAll(params: TOfficeManagementDocumentTypeFilter) {
    return paymentsInstance.get(`${BASE_URL}`, { params });
  },
  add(params: TOfficeManagementDocumentType) {
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
  edit(params: TOfficeManagementDocumentType) {
    return paymentsInstance.put(`${BASE_URL}/${params.id}`, { ...params });
  },
};

export default api;
