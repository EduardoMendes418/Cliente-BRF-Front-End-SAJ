import { TProcess, TProcessFormData } from './process'
import { ParamsGet, TLogs, TPossibleApprovers } from '.';
import { STATUS_APPROVALS_FLOW } from '../utils/constants';
import { TUserDefault } from './users';

export type TPaymentType = {
	id: number | null;
	descricao: string;
	status: boolean;
	moduloId: number | null
}

export type TPaymentGeneralData = {
	dataSolicitacao: string | null;
	dataPagamento: string | null | any;
	advogadoInterno: string;
	advogadoInternoId?: number | null;
	observacao: string;
	requesterId?: number;
	formaPagamento?: TPaymentType;
	process?: any;
	fluxoAprovacao?: number;
	folderNumber?: string;
	statusFlowId?: number
};

export type TComplementData = {
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
	internalLawyerId?: number,
	isInternal?: boolean;
	formaPagamento?: any;
	files?: any;
};

export type TPaymentFavoredData = {
	cpf: string;
	nomeReclamante: string;
	bancoId: number | '';
	agencia: string;
	agenciaDv: string;
	conta: string;
	contaDv: string;
	dataNascimento: string | null;
	email: string;
	telefone: string;
	cep: string;
	endereco: string;
	numero: string;
	bairro: string;
	cidadeId: number | '';
	estadoId: number | '';
	fornecedor: string,
	fornecedorId: string | any,
	bankType?: SupplierBankType,
	decisionType?: any;
};

export type TPaymentDataDefault = {
	eSocialLinkedPaymentId?: number | null
	valorPrincipal: number | '';
	valorMulta: number | '';
	valorJuros: number | '';
	encargo: number | '';
	valorOutrasEntidades: number | '';
	sucumbencia: number | '';
	valorPagamentoJudicial: number | '';
	valorJurosHistorico: number | '';
	eSocialRestriction?: boolean;
	decisionType?: any;
	valorTotalGuia?: any
};

export type TPaymentDatasDefault = TPaymentESocial & TPaymentFavoredData & TPaymentDataDefault

export type TPaymentDataFGTS = TPaymentESocial & {
	eSocialLinkedPaymentId?: number | null
	periodoApuracao: string | null;
	baseCalculo: number | '' | string;
	valorPrincipal: number | '';
	valorMulta: number | '';
	valorJuros: number | '';
	valorJurosHistorico: number | '';
	encargo: number | '';
	valorOutrasEntidades: number | '';
	sucumbencia: number | '';
	valorPagamentoJudicial: number | ''; // valor total
	fornecedor: string;
	fornecedorId: string;
	contaContabil: string;
	eSocialRestriction: boolean;
	status?: any;
	dataGuiaGerada?: string | null;
	guiaGerada?: boolean | null;
	id?: number;
};

export type TPaymentESocial = {
		pagamentosESocial?: null | {
		id: number
		agreementApprovalDate: string
		remunerationAmount: number
		compensationAmount: number
		fgtsReflexes: number
		cprb: number
		startDateForESocialCalculation: string
		endDateForESocialCalculation: string
		typeOfEmploymentContract: string	
		decisionType: number | ""
		ESocialEvent?: any
		observation: string
	}
};

export type TPaymentsToEsocialLink = {
	cpf: string
	favored: string
	folderNumber: string
	judicialPaymentValue: number
	oppositeParty: string
	paymentId: number
	checked?: boolean
}

export type TPaymentDataGPS = Omit<
	TPaymentDataFGTS,
	'contaContabil'
> & TPaymentESocial & {
	valorINSSReclamante: number | '';
	valorINSSReclamado: number | '';
	valorOutrasEntidades: number | '';
	dataGuiaGerada?: string | null;
	guiaGerada?: boolean | null;
};

export type TPaymentDataGuides = TPaymentDataDefault & {
	empresa: string;
	bancoId: number;
	banco: string;
	numeroContaJudicial: string;
	fornecedor: string;
	fornecedorId: string;
	guiaGerada?: boolean | null;
	dataGuiaGerada?: string | null;
	id?: number;
}	

export type TPaymentDataIRRF = TPaymentESocial & {
	eSocialLinkedPaymentId?: number | null
	periodoApuracao: string | null;
	baseCalculo: number | '';
	valorPrincipal: number | '';
	valorMulta: number | '';
	valorJuros: number | '';
	valorJurosHistorico: number | '';
	valorPagamentoJudicial: number | '';
	encargo: number | '';
	valorOutrasEntidades: number | '';
	sucumbencia: number | '';
	rendimentoTributavel: number | '';
	previdenciaOficial: number | '';
	quantidadeMeses: number | '';
	fornecedor: string;
	fornecedorId: string;
	cpf: string;
	nomeReclamante: string;
	numeroProcesso: string;
	cpfPerito: string;
	nomePerito: string;
	eSocialRestriction: boolean;
	status?: any;
	dataGuiaGerada?: string | null;
	guiaGerada?: boolean | null;
	id?: number;
};

export type TPaymentFormDefault = TPaymentDatasDefault & TPaymentGeneralData & TPaymentESocial;
export type TPaymentFormFGTS = TPaymentDataFGTS & TPaymentGeneralData & TPaymentESocial;
export type TPaymentFormGPS = TPaymentDataGPS & TPaymentGeneralData & TPaymentESocial;
export type TPaymentFormGuides = TPaymentDataGuides & TPaymentGeneralData & TPaymentESocial;
export type TPaymentFormIRRF = TPaymentDataIRRF & TPaymentGeneralData & TPaymentESocial;

export type TFiles = {
	id: number;
	pagamentoId: number;
	documentName: string;
	path: string;
};

export type TPaymentFormGeneral = {
	id: number;
	banco: string;
	processPartiesOther?: any;
	bancoId: number;
	contaJudicial: string;
	folderNumber: string;
	tipoPagamentoId: number;
	formaPagamentoId: number;
	files: FileList;
	filesEsocial: any;
	filesGuide?: any;
	eSocialCalcFile?: any;
	statusApprovalId: STATUS_APPROVALS_FLOW;
	form: string;
	logs: TLogs[];
	possibleApprovers: TPossibleApprovers[];
	process: TProcess | null;
	statusFlowId: STATUS_APPROVALS_FLOW;
	requester?: TUserDefault;
	accountingSAPResponses?: any[];
	paymentOrders?: any;
	eSocialEventLaunchStatus?: number
	decisionType?: any;
	fluxoAprovacao?: number
	agreementApprovalDate?: string;
	startDateForESocialCalculation?: string,
	endDateForESocialCalculation?: string,
	filesIsGuide?: FileList | any;
};

export type TPropsForm = {
	hasItem: boolean;
	showEmptyForm?: boolean;
	isApprovalLegalControl: boolean;
	isApprovalInternalLawyer: boolean;
};

export type TPayment = (
	| TPaymentFormDefault
	| TPaymentFormGuides
	| TPaymentFormFGTS
	| TPaymentFormGPS
	| TPaymentFormIRRF
) & TPaymentFormGeneral & TProcessFormData;

export type TPaymentRequestFilters = ParamsGet & {
	folderNumber?: string;
	requestDate?: string | null,
	startDate?: string | null,
	endDate?: string | null, 
	status?: STATUS_APPROVALS_FLOW | '';
	statusApprovalId?: STATUS_APPROVALS_FLOW;
	legalDepartmentArea?: string;
	legalDepartmentAreaId?: number;
	processNumber?: string;
	oppositeParty?: string;
	paymentTypeId?: number | '';
	paymentMethodId?: number | '';
	paymentDate?: string | null;
	dataPagamentoFim?: string | null,
  	dataPagamentoInicio?: string | null,
	paymentValue?: number | '';
	internalLawyer?: number | null;
	eSocialRestriction?: boolean 
	limit?: number;
	judicialPaymentValue?: number | "";
	paymentDateStart?: null | string,
	paymentDateEnd?: null | string,
	paymentId?: number | "",
}

export type TTypeForm = 'default' | 'guia' | 'fgts' | 'gps' | 'irrf'

export const renameProps = { aprovadores: 'possibleApprovers' }

export const renameFilterProps = {
	dataSolicitacao: 'requestDate',
	numeroProcesso: 'processNumber',
	outraParteId: 'oppositeParty',
	tipoPagamentoId: 'paymentTypeId',
	formaPagamentoId: 'paymentMethodId',
	dataPagamento: 'paymentDate',
	valorPagamentoJudicial: 'paymentValue',
	advogadoInternoId: 'internalLawyer'
}

export type TDIRF = {
	corpCeoCPF: string,
	anoCalendario: number | string,
	cpf: string,
	nome: string,
	telefone: number | string,
	telefoneDDD: number | string,
	telefoneRamal?: number | string
};

export type SupplierUpdateRequestData = {
	
	cpf: string,
	bancoId: number,
	agencia: string,
	agenciaDv: string,
	conta: string,
	contaDv: string,
	dataNascimento: string | null,
	email: string,
	telefone: string,
	cep: string,
	endereco: string,
	numero: string,
	bairro: string,
	cidadeId: number,
	estadoId: number,
	fornecedorId: string,
	nomeReclamante: string
	bankType?: SupplierBankType
	paymentAccountTypeId?: SupplierBankType
}

export type TRatValues = {
	claimed: number;
	rat: number;
	adjustedRat: number;
	otherEntities: number;
}

export enum SupplierBankType {
	CheckingAccount = 0,
	SavingsAccount = 1
}

export type TPaymentBank = {
	codBanco: string;
	codAgencia: number;
	digAgencia: number;
	codConta: string;
	digConta: number;
	codsapFornTransp: string;
};

export type TPaymentGenerateReversalRecords = {
	paymentIds: number[] | undefined,
	rejectionAndReturnReasonsId: number,
	justification: string,
}

export type TGeneratedGuide = {
	paymentId: number | undefined,
	generatedGuide: boolean,
	generatedDate: any
}