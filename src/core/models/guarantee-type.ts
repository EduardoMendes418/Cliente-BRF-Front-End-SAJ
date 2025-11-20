import { ParamsGet } from 'src/core/models';

export type TGuaranteeType = {
	id: number;
	description: string;
	status: boolean;
	paymentTypeId: number
}

export type TGuaranteeDescription = {
	description: string;
}

export type TGuaranteeFilter = ParamsGet & Partial<TGuaranteeDescription>
