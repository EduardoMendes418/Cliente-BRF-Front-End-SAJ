import { paymentsInstance } from ".";
import {
    TInspectionType,
    TInspectionTypeFilter,
} from "../models/inspection-type";

const BASE_URL = "InspectionPaymentType";

const inspectionTypeApi = {
    list({ id, notPaginate, page, pageSize, describe }: TInspectionTypeFilter) {
        return paymentsInstance.get(BASE_URL, {
            params: { page, pageSize, id, notPaginate, describe },
        });
    },
    add(value: TInspectionType) {
        return paymentsInstance.post(
            BASE_URL,
            JSON.stringify({ status: true, ...value })
        );
    },
    edit(id: string, value: TInspectionType) {
        return paymentsInstance.put(BASE_URL, JSON.stringify(value));
    },
    delete(id: string) {
        return paymentsInstance.delete(`${BASE_URL}/${id}`);
    },
};

export default inspectionTypeApi;
