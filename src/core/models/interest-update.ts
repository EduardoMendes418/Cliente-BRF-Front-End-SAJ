import { ParamsGet } from 'src/core/models';

export type TInterestUpdate = {
	id: number;
	companyId: number;
	legalDepartmentAreaId: number;
	bankId: number;
	accounPaymentTypeIdtTypeId: number;
	currectionFormulaId: number;
	depositStatus: number;
	paymentDateStart: string | null;
	paymentDateEnd: string | null;
	companyName: string;
	accountTypeDescription: string;
	legalDepartmentAreaName: string;
	paymentTypeDescription: string;
	paymentTypeId: string;
	bankName: string;
	status: boolean;
	closureName: string
}

export type TAddInterestUpdate = Omit<TInterestUpdate, 'id'>

export type TInterestUpdateFilterForm = {
	closureId: number[]
	legalDepartmentAreaId: number[]
	accountTypeId: number[]
	bankId: number[]
	currectionFormulaId: number[];
	status?: number[];
}

export type TInterestUpdateFilter = ParamsGet & Partial<Pick<
	TInterestUpdate,
	'id' | 'companyId' | 'legalDepartmentAreaId'
>>