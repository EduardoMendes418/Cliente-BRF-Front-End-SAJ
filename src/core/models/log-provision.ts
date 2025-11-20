import { ParamsGet } from '.';

export type TLogProvisionBasicParameters = {
	folderNumber: string;
	monthAndYear?: string | null;
};

export type TLogProvisionParameters = ParamsGet & TLogProvisionBasicParameters


export type TLogProvision = {
	id: number
	orderId: number
	legalOneOrderId: number
	processId: number
	monthAndYear: string
	orderName: string
	ratingId: number
	ratingDescription: string
	probabilityDescription: string
	previousValue: number
	changedValue: number
	updatedDate: string
	updatedBy: string
	updateReason: string
};