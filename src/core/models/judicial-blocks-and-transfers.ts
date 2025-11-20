import { OCCURRENCE_TYPE, STATUS_FLOW } from "src/screen/judicial-blocks-and-transfers/constants";
import { TProcess } from "./process";
import { TLogs } from ".";
import { OCCURENCE_REASON_TYPE } from 'src/core/utils/occurence-reason-util';
import { TPossibleApprovers } from 'src/core/models';

export type TJudicialBlocksAndTransfers = {
	id?: number;
	folderNumber: string;
	process?: TProcess;
	createdDate: string;
	statusFlowId: STATUS_FLOW;
	bankId: number | '';
	occurrenceType: OCCURRENCE_TYPE | '';
	occurrenceReason: number | '';
	occurrenceReasonType?: OCCURENCE_REASON_TYPE;
	aprovadores?: TPossibleApprovers[];
	updateMethod: string;
	blockOrTransfDate: string | null;
	locateDistrict: string;
	accountingDocumentNumber: string;
	bankToSendLicense: string | number;
	judicialAccountNumber: string;
	value: number;
	mainValue: number,
	fineValue: number,
	valueCharges: number,
	succumbingValue: number,
	historicalInterestValue: number,
	description: string;
	finishedDate?: string;
	financeChartOfAccountsCategoryName?: string;
	logs?: TLogs[];
	files?: FileList | any;
	paymentId?: number;
	goodsGuaranteesRequestId?: number;
	statusApprovalId?: string | number;
	agency: string;
	blockedaccountnumber: string;
	responsiblename: string;
	company?: string | "";
	exercise?: string | "";
	unlockdate?: string | null;
	destinationBankAccountId?: string | "";
	companyDocumentUnlock?: string | "";
	exerciseDocumentUnlock?: string | "";
	unlockDocumentNumber?: string | "";
	processId?: number | "";
	evaluatorId?: number;
	judicialBlocksAndTransferOrders?: any
	abaterSaldoProvisao?: number;
	endDateOfEvent?: string | '';
	balanceBlocking: boolean;
}

export type TJudicialBlocksAndTransfersFilters = {
	folderNumber?: string;
	id?: string | null;
	occurrenceType?: OCCURRENCE_TYPE | '';
	statusFlowId?: STATUS_FLOW | '';
	requestDate?: string | null;
	blockOrTransfDateStart?: string | null;
	blockOrTransfDateEnd?: string | null;
	statusApprovalId?: number | '';
	validationDateStart?: string | null;
	validationDateEnd?: string | null;
	registrationDateStart?: string | null
	registrationDateEnd?: string | null
	occurrenceReasons?: number[] | '';
	bankId?: number | '';
	intLawIds?: number | null;
}

export type TJudicialBlocksAndTransfersParams = TJudicialBlocksAndTransfersFilters & {
	page?: number;
	pageSize?: number;
	folderNumber?: string;
	statusFlowId?: number;
};

export type TUpdateStatus = {
	id?: number;
	statusFlowId: number;
	observation?: string;
	rejectionAndReturnReasonsId?: number | ''
}

export type TJudicialBlocksAndTransfersAcconting = {
	id: number
	judicialBlocksAndTransferId: number
	folderNumber: string
	messageType: string
	message: string
	releaseDate: Date
	company: string
	exercice: string
	documentNumber: string
	createdDate: Date
	createdBy?: string
	updatedDate: Date
	updatedBy?: string
}

export type TJudicialBlocksAndTransfersAccontingFilter = {
	id: number
	folderNumber: string
}