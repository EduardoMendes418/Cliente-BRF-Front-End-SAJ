import { ACCOUNT_TYPES, NOTE_TYPES, RELEASE_TYPES, ACCOUNTABILITY_SITUATION, ACCOUNTABILITY_STATUS } from "src/screen/goods-and-guarantees/accountability/constants";
import { BEARISH_REASONS } from "src/screen/goods-and-guarantees/constants";
import { ParamsGet, TLogs, TSystemDate } from ".";
import { TGoodsGuaranteesRequest, renameProps as renamePropsRequest } from "./goods-guarantee";
import { TPossibleApprovers } from 'src/core/models';
export type TGuaranteeAccountabilityReverse = {
	accountabilityIds: number[];
	creditReceiptIds: number[];
	note: number;
	email: string;
	evaluationDescription: string;
	justification: string;
	rejectionAndReturnReasonsId?: number | '';
	files?: FileList | any[];
}
export type TGuaranteeAccountability = {
	replacementGoodGuaranteeId: number;
	id?: number | string;
	accountabilityStatusToShow?: string;
	statusFlowId: ACCOUNTABILITY_STATUS;
	folderNumber: string;
	goodsGuaranteesRequestId: number | '';
	goodsGuaranteesRequest?: TGoodsGuaranteesRequest;
	accountabilityDate: TSystemDate;
	applicantName: string;
	amountWrittenOff: number;
	bearishReasons: BEARISH_REASONS;
	licenseNumber: string;
	licenseDate: TSystemDate | null;
	statusApprovalId?: number;
	email: string;
	description: string;
	logs?: TLogs[];
	files?: FileList | any;
	accountabilityOrders?: any;
	fine: number;
	historicalInterest: number;
	guaranteeModality?: string;
	bearishReasonsText?: string;
	charge: number;
	succumbence: number;
	totalAmountWrittenOff: number;
	updateAmountWrittenOff: number;
	creditReceiptId?: null | number;
	licenseType: number | '';
	accountType: ACCOUNT_TYPES | '';
	releaseType: RELEASE_TYPES | '';
	sapEntryNumber: string;
	accountabilityApprovals: TPossibleApprovers[];
	documentDate: string;
	creditedAmount: number;
	incomeTax: number;
	numberOfCasualties: number;
	electronicTransferRate: number;
	covenantRate: number;
	updateValueCredited: number;
	submissionDate: string;
	pendingTime: number;
	bankToSendLicence: string;
	status: ACCOUNTABILITY_SITUATION;
	ctgTransfered: string;
	accountTransferred: string;
	note: NOTE_TYPES;
	evaluationDescription: string;
	guaranteeDate: string;
	valueGuarantee: number;
	writeOffDate: string;
	evaluator: string | null;
	valuationDate: string | null;
	createdDate?: string | null;
	justification?: string;
	reasonForFailure?: number | null | '';
	judicialBlocksAndTransferId: null | number
	reverseAccounting?: boolean;
	reverseAccountingChecked?: boolean;
	parentAccountabilityId?: number
	guaranteeModalityId?: number
	requestTypeId?: number
	guaranteeModeId?: number
};

export type TGuaranteeAccountabilityFilters = ParamsGet & {
	folderNumber?: string;
	goodId?: number | string;
	guaranteeModeId?: '' | null;
	statusFlowIds?: number[] | null
	accountabilityDateStart?: string | null
	accountabilityDateEnd?: string | null,
	bearishReasons?: number[] | null
	status?: string;
	statusApprovalId?: number | '',
	valuationDateStart?: string | '',
	valuationDateEnd?: string | '',
	IntLawIds?: number | null
};

export type TUpdateStatus = {
	id?: number;
	statusFlowId: ACCOUNTABILITY_STATUS;
	observation?: string;
	attachments?: FileList;
	rejectionAndReturnReasonsId?: number | '';
}

export const renameProps: { [key: string]: string | any[] } = {
	goodsGuaranteesRequest: ['goodsGuaranteesRequest', renamePropsRequest],
}
