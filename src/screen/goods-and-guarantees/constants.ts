import { getOptionsAsObject } from "src/core/utils/func";
import { statusTextApprovalsFlow, STATUS_APPROVALS_FLOW } from "src/core/utils/constants";

export enum ACCOUNT_TYPES {
	NONE,
	APPEAL,
	JUDICIAL
}

export enum UPDATE_TYPE {
	CLAUSE_UPDATE = 1,
	VALUE_UPDATE = 2,
	ANNIVERSARY = 3,
	DEADLINE = 4
}

export enum RECORD_TYPE {
	REQUEST = 1,
	EFFECTIVE = 2
}

export enum TYPE_FLOW {
	NONE,
	INSURANCE,
	PROPERTY,
	LETTER,
	JUDICIAL_DEPOSIT,
}

export enum STATUS_FLOW {
	NONE = -1,
	REJECTED_DEFINITIVE,
	APPROVED_DEFINITIVE,
	RETURNED,
	REQUESTED,
	IN_REVIEW,
	APPROVED_DRAFT,
	RETURNED_DRAFT,
	IN_REVIEW_DRAFT,
	REVERSAL = 11,
	REJECTED = 15,
	ANEXO = 21
} 

export enum RELEASE_TYPES {
	NONE,
	TRANSFER_BETWEEN_ACCOUNTS,
	FOR_SURVEY
}

export enum ACCOUNTABILITY_STATUS {
	PENDING,
	DEAD,
	FOR_WITHDRAWAL,
	OVERTURNED,
	RETURNED_JURIDICAL,
	RETURNED_ANALYSIS,
	RETURNED_OFFICE,
	IN_CANCELLATION
}

export enum BEARISH_REASONS {
	NONE,
	REPLACEMENT,
	RELEASED_TO_COMPANY,
	CONVERTED_TO_PAYMENT,
	TRANSFER_BETWEEN_ACCOUNTS,
	LOW_FOR_LOSS,
	IN_RECOVERY,
	UNLOCKED,
	TRANSFER_BETWEEN_PROCESS,
	RELEASED_GUARANTEE,
	INTERNAL_DELIBERATION_REPLACEMENT
}

export enum ACCOUNTABILITY_SITUATION {
	PENDING,
	APPROVED,
	REJECTED,
	OFFICE_PENDING,
}

export enum NOTE_TYPES {
	NONE,
	WRITE_OFF,
	REVERSAL,
	UPDATE,
	ADDITION,
	NOT_APPLICABLE
}

export enum REQUEST_TYPE {
	NEW_GUARANTEE = 1,
	UPDATE_ENDORSEMENT = 2,
	TERM_RENEWAL = 3,
	TEDESCO_MIGRATION = 100
}

export enum STATUS_ACCOUNTABILITY {
	PENDING,
	APPROVED,
	REJECTED,
	PENDING_OFFICE
}

export const requestTypesOptions = [
	{ label: 'Nova garantia', value: REQUEST_TYPE.NEW_GUARANTEE },
	{ label: 'Endosso de atualização', value: REQUEST_TYPE.UPDATE_ENDORSEMENT },
	{ label: 'Renovação de prazo', value: REQUEST_TYPE.TERM_RENEWAL }
];

export const requestTypesOptionsAll = [
	...requestTypesOptions,
	{ label: 'Migração', value: REQUEST_TYPE.TEDESCO_MIGRATION }
];

export const updateTypesOptions = [
	{ label: 'Atualização de cláusula', value: UPDATE_TYPE.CLAUSE_UPDATE },
	{ label: 'Atualização de valor', value: UPDATE_TYPE.VALUE_UPDATE },
	{ label: 'Aniversário', value: UPDATE_TYPE.ANNIVERSARY },
	{ label: 'Prazo', value: UPDATE_TYPE.DEADLINE },
];

export const statusApprovalsFlow = {
	...statusTextApprovalsFlow,
	[STATUS_APPROVALS_FLOW.REQUESTED]: 'Solicitado',
	[STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE]: 'Validado controle jurídico',
	[STATUS_APPROVALS_FLOW.APPROVED]: 'Validado parcialmente',
}

export const notJudicialDepositBearishReasonsOptions = [
	{ value: BEARISH_REASONS.REPLACEMENT, label: 'Substituição' },
	{ value: BEARISH_REASONS.RELEASED_GUARANTEE, label: 'Garantia liberada' },
]

export const statusTextProperty = {
	[STATUS_FLOW.NONE]: statusTextApprovalsFlow[STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE],
	[STATUS_FLOW.REJECTED_DEFINITIVE]: 'Bem não disponível',
	[STATUS_FLOW.APPROVED_DEFINITIVE]: 'Bem disponibilizado',
	[STATUS_FLOW.RETURNED]: 'Devolvido',
	[STATUS_FLOW.REQUESTED]: 'Bem solicitado',
	[STATUS_FLOW.IN_REVIEW]: 'Validado Controles Jurídico'
}

export const statusTextLetter = {
	[STATUS_FLOW.NONE]: statusTextApprovalsFlow[STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE],
	[STATUS_FLOW.REJECTED_DEFINITIVE]: 'Bem não disponível',
	[STATUS_FLOW.APPROVED_DEFINITIVE]: 'Carta fiança disponibilizada',
	[STATUS_FLOW.RETURNED]: 'Devolvido',
	[STATUS_FLOW.REQUESTED]: 'Carta fiança solicitada',
	[STATUS_FLOW.IN_REVIEW]: 'Validado Controles Jurídico',
	[STATUS_FLOW.RETURNED_DRAFT]: "Bem não disponível"
}

export const statusTextInsurance = {
	[STATUS_FLOW.NONE]: statusTextApprovalsFlow[STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE],
	[STATUS_FLOW.REJECTED_DEFINITIVE]: 'Solicitação cancelada',
	[STATUS_FLOW.APPROVED_DEFINITIVE]: 'Minuta final aprovada',
	[STATUS_FLOW.RETURNED]: 'Minuta devolvida',
	[STATUS_FLOW.REQUESTED]: 'Minuta solicitada',
	[STATUS_FLOW.IN_REVIEW]: 'Minuta disponibilizada',
	[STATUS_FLOW.APPROVED_DRAFT]: 'Aguardando minuta final',
	[STATUS_FLOW.RETURNED_DRAFT]: 'Minuta final devolvida',
	[STATUS_FLOW.IN_REVIEW_DRAFT]: 'Minuta final em análise',
	[STATUS_FLOW.IN_REVIEW]: 'Validado Controles Jurídico'
}

export const accountTypesOptions = [
	{ value: ACCOUNT_TYPES.APPEAL, label: 'Recursal' },
	{ value: ACCOUNT_TYPES.JUDICIAL, label: 'Judicial' },
];

export const commonAccountabilityStatusOptions = [
	{ value: ACCOUNTABILITY_STATUS.PENDING, label: 'Pendente' },
	{ value: ACCOUNTABILITY_STATUS.DEAD, label: 'Morto' },
];
export const commonAccountabilityStatusOptionDead = [
	{ value: ACCOUNTABILITY_STATUS.DEAD, label: 'Morto' },
	{ value: ACCOUNTABILITY_STATUS.RETURNED_OFFICE, label: 'Devolvido escritório' },
	{ value: ACCOUNTABILITY_STATUS.RETURNED_JURIDICAL, label: 'Devolvido jurídico' },
];

export const bearishReasonsOptions = [
	{ value: BEARISH_REASONS.RELEASED_TO_COMPANY, label: 'Liberado à empresa' },
	{ value: BEARISH_REASONS.CONVERTED_TO_PAYMENT, label: 'Convertido em pagamento' },
	{ value: BEARISH_REASONS.TRANSFER_BETWEEN_ACCOUNTS, label: 'Transferência entre contas' },
	{ value: BEARISH_REASONS.LOW_FOR_LOSS, label: 'Baixa para perda' },
	{ value: BEARISH_REASONS.TRANSFER_BETWEEN_PROCESS, label: 'Transferência entre processos' },
]

export const depositAccountabilityStatusOptions = [
	...commonAccountabilityStatusOptions,
	{ value: ACCOUNTABILITY_STATUS.FOR_WITHDRAWAL, label: 'Para saque' },
	{ value: ACCOUNTABILITY_STATUS.OVERTURNED, label: 'Estornado' },
	{ value: ACCOUNTABILITY_STATUS.RETURNED_JURIDICAL, label: 'Devolvido jurídico' },
	{ value: ACCOUNTABILITY_STATUS.RETURNED_ANALYSIS, label: 'Em análise' },
	{ value: ACCOUNTABILITY_STATUS.RETURNED_OFFICE, label: 'Devolvido escritório' },
];
export const depositAccountabilityStatusOptionsNoOverturned = [
	...commonAccountabilityStatusOptions,
	{ value: ACCOUNTABILITY_STATUS.FOR_WITHDRAWAL, label: 'Para saque' },
	{ value: ACCOUNTABILITY_STATUS.OVERTURNED, label: 'Estornado' },
	{ value: ACCOUNTABILITY_STATUS.RETURNED_JURIDICAL, label: 'Devolvido jurídico' },
	{ value: ACCOUNTABILITY_STATUS.RETURNED_ANALYSIS, label: 'Em análise' },
	{ value: ACCOUNTABILITY_STATUS.RETURNED_OFFICE, label: 'Devolvido escritório' },
];

export const insuranceAccountabilityStatusOptions = [
	...commonAccountabilityStatusOptions,
	{ value: ACCOUNTABILITY_STATUS.IN_CANCELLATION, label: 'Em cancelamento' },
]

export const accountabilityStatusOptions = [
	...depositAccountabilityStatusOptions,
	...insuranceAccountabilityStatusOptions.filter(({ value }) => value === ACCOUNTABILITY_STATUS.IN_CANCELLATION)
]

export const commonSituationStatusOptions = [
	{ value: ACCOUNTABILITY_SITUATION.PENDING, label: 'Pendente' },
	{ value: ACCOUNTABILITY_SITUATION.APPROVED, label: 'Aprovada' },
	{ value: ACCOUNTABILITY_SITUATION.REJECTED, label: 'Reprovada' },
];

export const situationStatusOptions = [
	...commonSituationStatusOptions,
	{ value: ACCOUNTABILITY_SITUATION.OFFICE_PENDING, label: 'Pendente escritório' },
];

export const noteTypesOptions = [
	{ value: NOTE_TYPES.WRITE_OFF, label: 'Baixa' },
	{ value: NOTE_TYPES.REVERSAL, label: 'Reversão' },
	{ value: NOTE_TYPES.UPDATE, label: 'Atualização' },
	{ value: NOTE_TYPES.ADDITION, label: 'Adição' },
	{ value: NOTE_TYPES.NOT_APPLICABLE, label: 'N/A' }
];

export const depositAccountabilityStatusOptionsAsObject = getOptionsAsObject(depositAccountabilityStatusOptions);
export const accountabilityStatusOptionsAsObject = getOptionsAsObject(accountabilityStatusOptions);
export const situationStatusOptionsAsObject = getOptionsAsObject(situationStatusOptions);

export const approverAccountabilityStatus = [
	ACCOUNTABILITY_STATUS.DEAD,
	ACCOUNTABILITY_STATUS.FOR_WITHDRAWAL,
	ACCOUNTABILITY_STATUS.OVERTURNED,
]

export const requesterAccountabilityStatus = [
	ACCOUNTABILITY_STATUS.RETURNED_ANALYSIS,
	ACCOUNTABILITY_STATUS.RETURNED_JURIDICAL,
	ACCOUNTABILITY_STATUS.RETURNED_OFFICE,
]

export const returnedStatus = [
	ACCOUNTABILITY_STATUS.RETURNED_JURIDICAL,
	ACCOUNTABILITY_STATUS.RETURNED_OFFICE,
	ACCOUNTABILITY_STATUS.RETURNED_ANALYSIS,
]

export const statusToShowJustification = [
	...returnedStatus,
	ACCOUNTABILITY_STATUS.OVERTURNED
]

export const bearishReasonsOptionsList = [...bearishReasonsOptions, 
	{ value: BEARISH_REASONS.RELEASED_GUARANTEE, label: 'Garantia liberada' }, 
	{ value: BEARISH_REASONS.REPLACEMENT, label: 'Substituição' },
	
]

export const statusAccountabilityOptions = [
	{ label: "Pendente", value: STATUS_ACCOUNTABILITY.PENDING },
	{ label: "Aprovado", value: STATUS_ACCOUNTABILITY.APPROVED },
	{ label: "Reprovado", value: STATUS_ACCOUNTABILITY.REJECTED },
	{ label: "Pendente escritório", value: STATUS_ACCOUNTABILITY.PENDING_OFFICE },
]

export const bearishReasonsGoodsAndGuarantees = [...bearishReasonsOptions,
	{ value: BEARISH_REASONS.INTERNAL_DELIBERATION_REPLACEMENT, label: 'Substituído por deliberação interna' },
]