import { TOptionsSelect } from "src/components/form";
import { textToOptions } from "src/core/utils/func";

export const STATUS: { [key: string]: string } = {
	none: "Solicitado",
	reject: "Reprovado",
	return: "Devolvido",
	approval: "Aprovado",
};

export enum STATUS_APPROVALS_FLOW {
	NONE = -1,
	REJECTED_DEFINITIVE,
	APPROVED_DEFINITIVE,
	RETURNED,
	REQUESTED,
	APPROVED,
	CANCELLED,
	RETURNED_DRAFT,
	DROPPED = 10,
	REVERSAL = 11,
	CONTABILIZATION_ERROR = 8,
	NA = 20,
	RECEIPT_AVALIABLE = 22,
	WAITING_E_SOCIAL = 23,
	ESOCIAL_RETURN_WITH_ERRORS = 24,
	ESOCIAL_S_2500_ACCEPTED = 25
}

export const statusTextApprovalsFlow = {
	[STATUS_APPROVALS_FLOW.NONE]: "Solicitado",
	[STATUS_APPROVALS_FLOW.REJECTED_DEFINITIVE]: "Reprovado",
	[STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE]: "Aprovado",
	[STATUS_APPROVALS_FLOW.RETURNED]: "Devolvido",
	[STATUS_APPROVALS_FLOW.REQUESTED]: "Solicitado",
	[STATUS_APPROVALS_FLOW.APPROVED]: "Validado Controles Jurídicos",
	[STATUS_APPROVALS_FLOW.CANCELLED]: "Cancelado",
	[STATUS_APPROVALS_FLOW.RETURNED_DRAFT]: "Bem não disponível",
	[STATUS_APPROVALS_FLOW.CONTABILIZATION_ERROR]: "Erro na contabilização",
	[STATUS_APPROVALS_FLOW.DROPPED]: "Baixado",
	[STATUS_APPROVALS_FLOW.RECEIPT_AVALIABLE]: "Comprovante Disponibilizado"
} as any;

export const statusApprovalsOptions: TOptionsSelect[] = textToOptions(
	statusTextApprovalsFlow
);

export const statusApprovalIdPaymentAsOptions = [
	{ label: "Reprovado", value: STATUS_APPROVALS_FLOW.REJECTED_DEFINITIVE },
	{ label: "Pendente", value: STATUS_APPROVALS_FLOW.NONE },
	{ label: "Aprovado", value: STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE },
	{ label: "Erro na contabilização", value: STATUS_APPROVALS_FLOW.CONTABILIZATION_ERROR}
]

export const statusFlowIdAsOptions = [
	{ label: "Reprovado", value: STATUS_APPROVALS_FLOW.REJECTED_DEFINITIVE },
	{ label: "Aprovado advogado interno", value: STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE },
	{ label: "Devolvido", value: STATUS_APPROVALS_FLOW.RETURNED },
	{ label: "Solicitado", value: STATUS_APPROVALS_FLOW.REQUESTED },
	{ label: "Validado controle jurídico", value: STATUS_APPROVALS_FLOW.APPROVED },
	{ label: "Cancelado", value: STATUS_APPROVALS_FLOW.CANCELLED },
	{ label: "Comprovante disponibilizado", value: STATUS_APPROVALS_FLOW.RECEIPT_AVALIABLE },
	{ label: "Estornado", value: STATUS_APPROVALS_FLOW.REVERSAL}
]

export const statusTextFilter = [
	{ label: "Solicitado", value: 3 },
	{ label: "Devolvido", value: 2 },
	{ label: "Reprovado", value: 0 },
	{ label: "Validado Controles Jurídicos", value: 4 }, // statusApprovalId: -1 && statusFlowId: 4
	{ label: "Aprovado Advogado Interno", value: 1 }, // statusApprovalId: -1 && statusFlowId: 1
	{ label: "Aprovado", value: 6 }, // statusApprovalId: 1 && statusFlowId: 1
	{ label: "Cancelado", value: 5 },
	{ label: "Erro na contabilização", value: 8 },
	{ label: "Comprovante Disponibilizado", value: 22 },
	// { label: "Aguardando eSocial", value: 23 },
	// { label: "Retorno eSocial com erros", value: 24 },
	// { label: "eSocial aceito", value: 25 },

];

export enum CONTACT_TYPE {
	PERSON = 1,
	COMPANY,
}

export enum CONTACT_SEARCH {
	Agent = 1,
	InternalLawyer,
	OfficeResponsible,
	LegalResponsible
}

export enum TYPE_LINK_WITH_PROCESS {
	AGENT = 1,
	INTERNAL_LAWYER,
	OFFICE_RESPONSIBLE,
	COMPANY,
	RESPONSIBLE,
	OTHER_PART
}

export enum PROCESS_TYPE {
	JUDICIAL = "Judicial",
	ADMINISTRATIVO = "Administrativo",
}

export enum ENVOLVED_TYPE {
	MAIN = 1,
	OTHERS,
	BOTH
}

export const processTypeOptions = [
	{ label: "Judicial", value: PROCESS_TYPE.JUDICIAL },
	{ label: "Administrativo", value: PROCESS_TYPE.ADMINISTRATIVO },
];

export enum PROCESS_PHASE {
	Conciliatory = 1,
	Enforceable,
	Finished,
	Instructory,
	Judgment,
	Appeal,
}

export const processPhasesOptions = [
	{ label: "Conciliatória", value: PROCESS_PHASE.Conciliatory },
	{ label: "Executória", value: PROCESS_PHASE.Enforceable },
	{ label: "Finalizado", value: PROCESS_PHASE.Finished },
	{ label: "Instrutória", value: PROCESS_PHASE.Instructory },
	{ label: "Julgamento", value: PROCESS_PHASE.Judgment },
	{ label: "Recursal", value: PROCESS_PHASE.Appeal },
];

export const accountabilityStatusOptions: TOptionsSelect[] = [
	{ label: 'Pendente', value: STATUS_APPROVALS_FLOW.NONE },
	{ label: 'Reprovado', value: STATUS_APPROVALS_FLOW.REJECTED_DEFINITIVE },
	{ label: 'Aprovado', value: STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE },
	{ label: '-', value: STATUS_APPROVALS_FLOW.NA }
]

export const approversTextFlow = {
	[STATUS_APPROVALS_FLOW.NONE]: "Pendente",
	[STATUS_APPROVALS_FLOW.REJECTED_DEFINITIVE]: "Reprovado",
	[STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE]: "Aprovado"
} as any

 export const approversTextFlowPayment = {
	...approversTextFlow,
	[STATUS_APPROVALS_FLOW.CONTABILIZATION_ERROR]: "Erro de contabilização"
} 

export enum APPROVAL_PROCESS_TYPE {
	JR = "JR",
	TJ = "TJ",
	J1 = "J1",
	J2 = "J2",
	BI = "BI",
	FB = "FB",
	LC = "LC",
	SG = "SG",
	SE = "SE",
}
export const approvalProcessTypeText = {
	[APPROVAL_PROCESS_TYPE.JR]: "JR - Jurídico Contencioso",
	[APPROVAL_PROCESS_TYPE.TJ]: "TJ - Pagamento de Fiscalização Jurídico",
	[APPROVAL_PROCESS_TYPE.J1]: "J1 - Acordo Jur. Trab./Cível Massa",
	[APPROVAL_PROCESS_TYPE.J2]: "J2 - Acordo Jur. Cível Impac./Ambien",

	[APPROVAL_PROCESS_TYPE.BI]: "BI - Concessão Garant.Bens Móv/Imov",
	[APPROVAL_PROCESS_TYPE.FB]: "FB - Concessão Garant.Reais/Judeju",
	[APPROVAL_PROCESS_TYPE.LC]: "LC - Lançamento Contabil Manual",
	[APPROVAL_PROCESS_TYPE.SG]: "SG - Concessão Seguro-Garantia",
	[APPROVAL_PROCESS_TYPE.SE]: "SE - Contratação de Seguro Garantia e Carta Fiança"
}

export const approvalProcessTypeOption: TOptionsSelect[] = textToOptions(approvalProcessTypeText)