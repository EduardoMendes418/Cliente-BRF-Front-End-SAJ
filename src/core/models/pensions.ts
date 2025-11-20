import { ParamsGet, TPossibleApprovers } from ".";
import { TLogs } from 'src/core/models';

export type TPensionData = {
	areaId: number;
	costCenter: string;
	city: string;
	estado?: string;
	processId?: number;
};

export type TPensionPayeeData = {
	requestDate: string;
	cpf: string;
	fullName: string;
	nameOrCpf?: string;
	bornDate: string;
	paymentTypeId: number | '';
	paymentFormatId: number | '';
	bankId: number | '';
	agency: string;
	agencyDv: string;
	account: string;
	accountDv: string;
	pensionCategoryId: number | '';
	processReview: boolean;
	correctionFormId: number | '';
	decision: string;
	paymentStartDate: string;
	paymentFinishDate: string;
	installments: number;
	installmentsPending: number;
	monthlyPensionValue: number;
	pensionFgtsValue: number;
	fgtsPayment: boolean;
	pensionFgtsLinkedAccount: boolean;
	vacationPensionValue: number;
	vacationPayment: boolean;
	thirteenthSalaryValue: number;
	thirteenthSalaryPayment: boolean;
	termValue: number;
	shortTermValue: number;
	attachments?: any[];
	favoredId: number | null;
	statusFlowId?: number;
	statusApprovalId?: number | null;
	approvers?: TPossibleApprovers[]
	bancoId?: any;
	cidadeId?: any;
	estadoId?: any;
};

export type TPensionStatus = {
	requestStatus: number | '';
	closureReasonId: number | '';
	statusFlowId?: number;
	closureDate?: string | null;
	observationWriteOff?: string | null;
};

export type TPensionFiles = {
	id: number;
	pensionRequestId: number;
	documentName: string;
	path: string;
};

export type TPension = {
	id?: number;
	logs?: TLogs[];
	folderNumber: string;
	legalDepartmentArea: string;
	costCenter: string;
	gender: string | number;
	attachments?: any[];
	sapResponses?: TPensionRequestSapResponse[]
};

export type TRequestPension = TPension &
	TPensionData &
	TPensionPayeeData &
	TPensionStatus &
	TPensionRequestDeleteData;

export type TPensionClosureReason = {
	id: number;
	description: string;
};

export type TFormOfCorrection = {
	id?: number;
	descricao: string;
};

export type TPensionCategory = {
	id: number;
	description: string;
};

export type TRequestPensionFilters = ParamsGet & {
	areaId?: number | '';
	pensionCategoryId?: number | '';
	paymentFormatId?: number | '';
	folderNumber?: string;
	requestDate?: string | null;
	paymentStartDate?: string | null;
	fullName?: string;
	flowId?: number | '';
	requestStatus?: number | '';
};

export type TPeriodDateFilter = {
	startDate?: string | null;
	endDate?: string | null;
	date?: string | null;
}

export type TPensionActiveMonth = {
	id: number
	requestDate: string
	fullName: string
}

export const renameProps = { pensionRequestFiles: 'attachments' }

export type TPensionRequestDeleteData = {
	pensionRequestPayments?: any;
}

export type TPensionRequestSapResponse = {
	pensionRequestId: number
	folderNumber: string
	messageType: string
	message: string
	releaseDate: string
	company: string
	exercice: string
	documentNumber: string
	createdDate: string
}