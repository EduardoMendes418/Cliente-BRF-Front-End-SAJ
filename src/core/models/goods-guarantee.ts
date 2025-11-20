import { BEARISH_REASONS, RECORD_TYPE } from "src/screen/goods-and-guarantees/constants";
import { STATUS_APPROVALS_FLOW } from "../utils/constants";
import { TBudget } from "./goods-guarantee-estimates";
import { TJudicialBlocksAndTransfers } from "./judicial-blocks-and-transfers";
import { TUserDefault } from "./users";
import { TProcess } from "./process";
import { TLogs, TPossibleApprovers, TSystemDate, TUpdateStatus, ParamsGet, TPossibleApprovals } from ".";

export type TJudicialDepositPayment = {
	paymentDate: string;
	requestDate: string;
	legalAccountName: string;
	legalPaymentValue: number;
	internalLawyer: string;
	bank: string;
	observation: string;
	files: any[];
	paymentTypeId: number;
	interestUpdateMethodDescription?: string;
	interestUpdateMethodId?: number;
	financeChartOfAccountsCategoryName?: string;
}

export type TGoodsGuaranteesRequest = {
	conciliationKey?: string;
	replacementGoodGuarantee?: boolean | null;
	id?: number;
	folderNumber: string;
	updateTypeId: number | '';
	policyNumber: string;
	insuranceCompanyName?: string;
	insuranceCompanyId?: number;
	guaranteeTypeId: number;
	guaranteeMethodId: number | '';
	goodLocation: string;
	guaranteeDate?: string | null;
	finalDate?: string | null;
	dateOfAcknowledgment?: string | null;
	safeDate?: string | null;
	startEffective: TSystemDate;
	endEffective: TSystemDate;
	valueGuarantee: number | null;
	requestDate: string;
	description: string;
	statusApprovalId: STATUS_APPROVALS_FLOW;
	statusFlowId: number;
	requestTypeId: number | '';
	guaranteeModalityId: number | '';
	effectiveDate?: TSystemDate;
	goodsGuaranteesRequests?: any;
	files: any[];
	endorsements?: any[];
	process?: TProcess;
	estimates?: TBudget[];
	recordType: RECORD_TYPE;
	endorsementNumber?: string;
	emissionDate?: TSystemDate;
	observation?: string;
	legalBalance?: number;
	accountingBalance?: number;
	writeOffDate?: string;
	invoiceNumber?: string;
	registrationNumber?: string;
	fixedAssetRegistryNumber?: string;
	suretyLetterNumber?: string;
	goodsGuaranteesRequestId?: number;
	bankId?: number;
	goodGuaranteeLinked: number | '';
	endorsementStartDate: string | null;
	endorsementEndDate: string | null;
	isDeleted?: boolean;
	isActive?: boolean;
	logs?: TLogs[];
	approvers?: TPossibleApprovers[];
	approvals?: TPossibleApprovals[];
	paymentId?: number;
	payment?: TJudicialDepositPayment;
	judicialBlocksAndTransferId?: number;
	judicialBlocksAndTransfer?: TJudicialBlocksAndTransfers;
	updatedValue?: number;
	origin?: BEARISH_REASONS.TRANSFER_BETWEEN_ACCOUNTS | BEARISH_REASONS.TRANSFER_BETWEEN_PROCESS;
	fromAccountabilityId?: number;
	fromAccountabilityIds?: number[];
	account?: string;
	checked?: boolean;
	requester?: TUserDefault;
	amountWrittenOff?: number;
	updateAccountingBalance?: number;
	updateValue?: number;
	balanceUpdateNextMonth?: number;
	automaticUpdateJudicialDeposit?: boolean;
	interestUpdateMethodDescription?: string;
	interestUpdateMethodId?: number;
	insuranceCompany?: string;
	processId?: number;
	judicialBlockAndTransfer?:{} | null;
	financeChartOfAccountsCategoryName?: string
	paymentFinanceChartOfAccountsCategoryName?: null | string;
	judicialBlocksAndTransferFinanceChartOfAccountsCategoryName?: null | string;
	judicialBlocksAndTransferOccurrenceType?: null | string;
	occurrenceType?: null | string;
	guaranteeTypeName?: string;
	/* statusBem?: number;
	statusBemId?: number;
	statusBemDescription?: string; */
}

export type TGoodsGuaranteesRequestFilters = {
	id?: number | '';
	guaranteeModeId?: number | '';
	requestDate?: string | null;
	requestDateStart?: string | null;
	requestDateEnd?: string | null;
	folderNumber?: string;
	guaranteeDateStart?: null | string;
	guaranteeDateEnd?: null | string;
	guaranteeModalityId?: number | '';
	isActive?: boolean | "" | number;
	statusFlowId?: string
	typeFlows?: string
	statusFlowIdTemp?: string;
	requestTypeIdGeneral?: string;
	requesterId?: number | '';
	internalLawyer?: number | '';
	/* statusBem?: any */
}

export type TGoodsGuaranteesRequestParams = TGoodsGuaranteesRequestFilters & {
	page?: number;
	pageSize?: number;
	statusApprovalId?: STATUS_APPROVALS_FLOW;
	recordType?: RECORD_TYPE;
	isActive?: boolean;
	goodGuaranteeLinked?: number;
	typeFlows?: number[];
	folderNumber?: string;
	guaranteeModeId?: number;
	notPaginate?: boolean;
};

export type TGuaranteeFlowProperty = TUpdateStatus & {
	invoiceNumber: string;
	registrationNumber: string;
	observationRequest?: string;
	fixedAssetRegistryNumber: string;
	emissionDate: string | null;
	emails: string;
}

export type TGuaranteeFlowLetter = TUpdateStatus & {
	suretyLetterNumber: string;
	bankId: number | '';
	emails: string;
	observationRequest?: string
}

export type TGuaranteeFlowInsurance = TUpdateStatus & {
	emissionDate: TSystemDate | null;
	endorsementNumber: string;
	emails: string;
	estimates?: any;
}

export const renameProps: { [key: string]: string | any[] } = {
	guaranteeModeId: 'guaranteeModalityId',
	guaranteeFormId: 'guaranteeMethodId'
}


export type TGuaranteesNotificationFilter = {
	id?: number;
	goodsGuaranteesRequestId?: number;
	folderNumber?: string;
	userId?: number;
} & ParamsGet

export type NotificationFilter = Pick<TGuaranteesNotificationFilter, 'userId' | 'page' | 'pageSize'>

export type TGuaranteesNotification = {
	id: number;
	goodsGuaranteesRequestId: number;
    userId: number;
	isUserAwared: boolean;
	userAwaredDate: string | null;
    isUserPostponed: boolean;
    userPostponedDate: string | null;
	isUserAnswered: boolean;
	userAnsweredDate: string | null;
    message: string;
	goodsGuaranteesRequest: TGoodsGuaranteesRequest
}

export const statusBemAsOption = [
	{label: 'Ativo', value: 1},
	{label: 'Endossada', value: 2},
	{label: 'Não vigente', value: 3},
	{label: 'Morto', value: 4},
]