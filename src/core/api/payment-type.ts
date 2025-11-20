import { paymentsInstance } from ".";
import {
  TPaymentType,
  TPaymentTypeFilters,
} from "src/core/models/payment-type";

const BASE_URL = "TipoPagamento";

const paymentTypeAPI = {
  list({
    id,
    page,
    pageSize,
    desc,
    modulo,
    notPaginate,
    status,
		eSocialRestriction,
  }: TPaymentTypeFilters) {
    return paymentsInstance.get(`${BASE_URL}/${id ?? ""}`, {
      params: { page, pageSize, desc, modulo, notPaginate, status, eSocialRestriction },
    });
  },

  add(value: TPaymentType) {
    return paymentsInstance.post(BASE_URL, JSON.stringify(value)); 
  }, 

  edit(id: string, value: TPaymentType) {
    return paymentsInstance.put(BASE_URL, JSON.stringify(value)); 
  },

  delete(id: string) {
    return paymentsInstance.delete(`${BASE_URL}/${id}`);
  },
};

export default paymentTypeAPI;
