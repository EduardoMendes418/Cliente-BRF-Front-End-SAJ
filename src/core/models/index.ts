import { Moment } from "moment";
import { ACCOUNTABILITY_STATUS } from "src/screen/goods-and-guarantees/accountability/constants";
import { STATUS_FLOW } from "src/screen/goods-and-guarantees/constants";
import { STATUS_FLOW as STATUS_JUDICIAL_BLOCKS_AND_TRANSFERS } from "src/screen/judicial-blocks-and-transfers/constants";
import { REQUEST_STATUS_FLOW } from "src/screen/pensions/request/constants";
import { STATUS_APPROVALS_FLOW } from "../utils/constants";

export type TDate = `${number}/${number}/${number}`

export type TSystemDate = `${number}-${number}-${number}` | Date | Moment | null

export type TStatus = 'initial' | 'fetching' | 'saving' | 'edited' | 'failure' | 'added' | 'deleted' | 'imported';

export type STATUSES_FLOW = STATUS_FLOW
	| STATUS_JUDICIAL_BLOCKS_AND_TRANSFERS
	| STATUS_APPROVALS_FLOW
	| ACCOUNTABILITY_STATUS
	| REQUEST_STATUS_FLOW

export type TLogs = {
	id?: number;
	requestId?: number;
	logDataFromId: number;
	statusapprovalid?: number;
	statusApprovalId: STATUS_APPROVALS_FLOW;
	statusFlowId: STATUSES_FLOW | any;
	userName: string;
	occurrenceDate: string;
	observation: string;
	dueDate?: string | null;
	rejectionAndReturnReasonsId: number;
}

export type TPossibleApprovers = {
	approverName: string;
	sequence: number;
	hierarchyDescription: string;
	nameApprover?: string;
	codeHierarchy?: string;
}

export type TState = {
	status: TStatus;
	error?: unknown;
}

export type TBreadcrumbs = {
	label: string;
	url?: string;
}

export type ParamsGet = {
	id?: number | string;
	page?: number;
	pageSize?: number;
	notPaginate?: boolean;
	OrderById?: boolean;
};

export type TUpdateStatus = {
	statusApprovalId?: number;
	id: number;
	statusFlowId: number;
	requestStatus?: number;
	closureDate?: string | Date;
	insuranceCompany?: string;
	observation?: string;
	closureReasonId?: number;
	attachments?: FileList;
	rejectionAndReturnReasonsId?: number | '';
	observationWriteOff?: string;
	emails?: string;
	flowEmails?: string
}

export type TApprovalFormData = {
	id: number;
	logs?: TLogs[];
	possibleApprovers?: TPossibleApprovers[];
	statusFlowId?: STATUS_APPROVALS_FLOW;
	statusApprovalId?: STATUS_APPROVALS_FLOW;
	approvalDateOfLegalControl?: string;
	approvalDateOfInternalLawyer?: string;
	approverOfLegalControl?: string;
	approverOfInternalLawyer?: string;
	observationOfLegalControl?: string;
	observationOfInternalLawyer?: string;
	isInternal?: boolean;
	internalLawyerId?: number | null;
	process?: any;
	cpf?: string;
	agencia?: string;
	fornecedorId?: string;
	conta?: string;
	agenciaDv?: string;
	contaDv?: string;
	bancoId?: number;
	tipoProcesso?: string;
	formaPagamentoId?: number;
};

export type TAccountingData = {
	type?: number;
	releaseDate: string | undefined;
	company: string | undefined;
	exercice: string | undefined;
	documentNumber: string | undefined;
	createdDate?: string | undefined;
}

export type TOptions = {
	id: number;
	name: string;
};

export type TDejurAreaFilter = {
	dejurArea?: number | '';
}

export type TUpdateBankAndJudicial = {
	id: number
	bankId: number
	judicialAccount: string
	files: FileList
	statusFlowId: number
}

export type TGetRatValues = {
	processId: number,
	paymentDate: string | Date
}

export type TPossibleApprovals = {
	approverName: string;
	sequence: number;
	hierarchyCode?: string;
	hierarchyDescription?: string;
	nameApprover: string;
	goodsGuaranteesRequestStatus: STATUS_APPROVALS_FLOW
	observation?: string
}