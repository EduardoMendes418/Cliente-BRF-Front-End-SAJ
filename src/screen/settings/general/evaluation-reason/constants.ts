import { getOptionsAsObject } from "src/core/utils/func";

export enum REASON_TYPE {
	REJECTION = 1,
	RETURN,
	REVERSAL,
	CANCELATION,
}

export const reasonTypeOptions = [
	{ value: REASON_TYPE.REJECTION, label: "Reprovação" },
	{ value: REASON_TYPE.RETURN, label: "Devolução" },
	{ value: REASON_TYPE.REVERSAL, label: "Estorno" },
	{ value: REASON_TYPE.CANCELATION, label: "Cancelamento" },
];

export const reasonTypeOptionsAsObject = getOptionsAsObject(reasonTypeOptions) as any;

