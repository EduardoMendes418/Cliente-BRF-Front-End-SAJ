import { ParamsGet } from ".";

export type TInspectionType = {
    id?: number;
    inspectionPaymentId: number;
    form: string;
};

export type TInspectionTypeFilter = ParamsGet & {
    describe?: string;
};
