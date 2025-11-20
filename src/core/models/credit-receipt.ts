import { STATUS_CREDIT_RECEIPT } from "src/screen/credit-receipt/constants";
import { TGuaranteeAccountability } from "./guarantee-accountability";
import { TPayment } from "./payment";
import { TUserDefault } from "./users";
import { ParamsGet, TLogs } from ".";
import { TPossibleApprovers } from 'src/core/models';

export type TUpdateStatus = {
	id: number;
	statusFlowId: STATUS_CREDIT_RECEIPT;
	observation?: string;
	dueDate?: string | null;
	reason?: number;
}

type Process = {
	costCenter: string;
	legalDepartmentArea: string;
}

export type TCreditReceipt = {
	id: number;
	folderNumber: string;
	processId: number | null;
	requestDate: string;
	statusFlowId: STATUS_CREDIT_RECEIPT;
	paymentTypeId: number | '';
	creditValue: number;
	licenseNumber: string;
	creditJudicialAccount: string;
	restatementInterestAmount: boolean;
	observation: string;
	paymentId?: number;
	willLinkAPayment?: boolean;
	aprovadores?: TPossibleApprovers[];
	evaluatorUserId: number | null;
	evaluatorUser?: TUserDefault;
	evaluatorDate: string | null;
	evaluatorCompany: string;
	evaluatorExercise: string;
	evaluatorSapDocument: string;
	evaluatorDocumentDate: string | null;
	evaluatorCreditedAmount: number;
	evaluatorIncomeTax: number;
	evaluatorElectronicTransferRate: number;
	evaluatorCovenantRate: number;
	evaluatorWriteOffQuantity: number | '';
	evaluatorAccount: string;
	evaluatorUpdateValueCredited: number;
	evaluatorWriteOffDate?: string | null;
	evaluatorSendBankDate: string | null;
	evaluatorPendingTime: number;
	evaluatorObservation: string;
	statusApprovalId?: number | string;
	status?: string;
	parentCreditReceiptsId?: number;

	process?: Process;
	payment?: TPayment;
	accountabilities?: TGuaranteeAccountability[];
	files?: any[];
	requestFiles?: any[];
	evaluationFiles?: any[];
	logs?: TLogs[];
	sapResponses?: TCreditReceiptAccountabilitySapResponse[]
};

export type TCreditReceiptFilters = {
	startDate?: string | null;
	endDate?: string | null;
	statusFlowId?: string;
	folderNumber?: string;
	paymentTypeId?: number | '';
	statusApprovalId?: number | '';
	evaluatorDateStart?: string | null;
	evaluatorDateEnd?: string | null;
	sapRequestDateStart?: string | null;
	sapRequestDateEnd?: string | null;
	intLawIds?: any[] | [] | "";
}

export type TCreditReceiptParams = ParamsGet & TCreditReceiptFilters;

export type TCreditReceiptAccountabilitySapResponse = {
	creditReceiptId: number
	releaseDate: string
}