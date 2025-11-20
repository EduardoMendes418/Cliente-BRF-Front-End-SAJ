import { STATUS_APPROVALS_FLOW } from '../utils/constants';
import {
	TPaymentDataDefault,
	TPaymentFormGeneral,
	TPaymentGeneralData
} from 'src/core/models/payment';
import { TProcessFormData } from './process'


export type TPaymentInspectionRequestFilters = {
	id?: number | null;
	folderNumber?: string;
	requestDate?: string | null,
	status?: STATUS_APPROVALS_FLOW | '' | null;
	statusApprovalId?: STATUS_APPROVALS_FLOW | null;
	legalDepartmentArea?: string;
	legalDepartmentAreaId?: number | null;
	processNumber?: string | null;
	oppositeParty?: string | null;
	paymentTypeId?: number | '' | null;
	paymentMethodId?: number | '' | null;
	paymentDate?: string | null;
	valorTotal?: number | string | null;
	valorTotalGuia?: any;
	bancoId?: number | '' | null;
	internalLawyer?: string | null;
	page?: number;
	pageSize?: number;
	notPaginate?: boolean;
}

export type TPaymentFavoredData = {
	files?: any;
	bancoId: number | '';
	agencia: string;
	agenciaDv: string;
	conta: string;
	contaDv: string;
	cnpj: string;
	mainResponsible: string;
	nomeReclamante: string;
	numero: string;
	telefone: string;
	cep: string;
	endereco: string;
	bairro: string;
	cidadeId: number | '';
	estadoId: number | '';
	fornecedor: string,
	fornecedorId: number | string | undefined;
	centroCusto: string;
	sapCodeCliFor?: string;
	valorTotalGuia?: any;
};

export type TPaymentInspectionApportionmentFine = {
	costCenter: string;
	costCenterDescription: string
	costCenterId: number;
	fineValue: number;
	id: number;
	paymentInspectionId: number;
	tipoPagamentoId?: number;
	divisao?: string;
}

export type TPaymentDatasDefault = TPaymentFavoredData & TPaymentDataDefault & {
	paymentInspectionApportionmentFines?: TPaymentInspectionApportionmentFine[]
};

export type TPaymentFormDefault = TPaymentDatasDefault & TPaymentGeneralData;

export type TPayment = (
	TPaymentFormDefault
) & TPaymentFormGeneral & TProcessFormData & {
	fluxoAprovacao?: number;
	filesIsGuide?: FileList;

};
