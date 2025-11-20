import {
  TOfficeManagementInvoice,
  TOfficeManagementInvoiceFilter,
} from "src/core/models/office-management-invoice";

import { paymentsInstance } from ".";

const BASE_URL = "OfficeManagementInvoice";

const api = {
  getAll(params: TOfficeManagementInvoiceFilter) {
    return paymentsInstance.get(`${BASE_URL}`, { params });
  },
  add(params: TOfficeManagementInvoice) {
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
  edit(params: TOfficeManagementInvoice) {
    return paymentsInstance.put(`${BASE_URL}/${params.id}`, { ...params });
  },
};

export default api;
