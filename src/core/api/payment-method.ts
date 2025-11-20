import { paymentsInstance } from ".";
import { Modulos } from "src/core/models/modules";
import { TPaymentMethod } from "src/core/models/payment-method";
import { ParamsGet } from "../models";

type Params = ParamsGet & { moduloId: Modulos; descricao?: string };

const BASE_URL = "FormaPagamento";

const paymentMethodAPI = {
    list({ id, page, pageSize, moduloId, descricao }: Params) {
        return paymentsInstance.get(`${BASE_URL}/${id ?? ""}`, {
            params: { page, pageSize, moduloId, descricao },
        });
    },

    add(value: TPaymentMethod) {
        return paymentsInstance.post(BASE_URL, JSON.stringify(value));
    },

    edit(id: string, value: TPaymentMethod) {
        return paymentsInstance.put(BASE_URL, JSON.stringify(value));
    },

    delete(id: string) {
        return paymentsInstance.delete(`${BASE_URL}/${id}`);
    },
};

export default paymentMethodAPI;
