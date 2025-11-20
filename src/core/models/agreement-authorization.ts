import { ParamsGet, TLogs, TPossibleApprovers } from "."
import { STATUS_APPROVALS_FLOW } from "../utils/constants";
import { TProcess } from "./process";

export type TAgreementAuthorization = {
	id?: number;
	folderNumber: string;
	paymentTypeId: number;
	maxAgreementValue: number | '';
	observation: string;
	attachments: FileList;
	statusApprovalId?: STATUS_APPROVALS_FLOW;
	process?: TProcess;
	logs?: TLogs[];
	possibleApprovers?: TPossibleApprovers[];
	approvers?: TPossibleApprovers[];
}

export type TAgreementAuthorizationNormalized = {
	id: number;
	folderNumber: string;
	paymentTypeId: number;
	maxAgreementValue: number | '';
	observation: string;
	attachments: FileList;
	legalDepartmentArea: string;
	legalDepartmentAreaId: number;
	costCenter: string;
	processNumber: string;
	status: string;
	logs: TLogs[];
	possibleApprovers: TPossibleApprovers[];
}

export type TAgreementAuthorizationSearch = ParamsGet & { folderNumber?: string };

export const renameProps = {
	tipoPagamentoId: 'paymentTypeId',
	files: 'attachments',
}