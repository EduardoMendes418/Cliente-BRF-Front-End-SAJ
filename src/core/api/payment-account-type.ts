import { paymentsInstance } from ".";
import { TPaymentAccountType } from "../models/payment-account-type";

const BASE_URL = "PaymentAccountType";

const api = {
    list() {
        return paymentsInstance.get(`${BASE_URL}`)
    },
    add(value: TPaymentAccountType) {
        return paymentsInstance.post(BASE_URL, JSON.stringify(value));
    },
    listById(id: number) {
        return paymentsInstance.get(`${BASE_URL}/${id}`)
    },
    edit(value: TPaymentAccountType) {
        return paymentsInstance.put(BASE_URL, JSON.stringify(value));
    },
    delete(id: string) {
        return paymentsInstance.delete(`${BASE_URL}/${id}`);
    },
};

export default api;