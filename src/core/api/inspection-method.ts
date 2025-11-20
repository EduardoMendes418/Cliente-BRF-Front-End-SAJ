import { paymentsInstance } from ".";
import { ParamsGet } from "../models";
import { TInspectionMethod } from "../models/inspection-method";

const BASE_URL = "InspectionPayment";

const inspectionMethodApi = {
    list({ page, pageSize }: ParamsGet) {
        return paymentsInstance.get(BASE_URL, {
            params: { page, pageSize },
        });
    },
    add(value: TInspectionMethod) {
        return paymentsInstance.post(
            BASE_URL,
            JSON.stringify({ status: true, ...value })
        );
    },
    edit(id: string, value: TInspectionMethod) {
        return paymentsInstance.put(BASE_URL, JSON.stringify(value));
    },
    delete(id: string) {
        return paymentsInstance.delete(`${BASE_URL}/${id}`);
    },
};

export default inspectionMethodApi;
