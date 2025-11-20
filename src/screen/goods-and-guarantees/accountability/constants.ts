import { getOptionsAsObject } from "src/core/utils/func";

export enum ACCOUNT_TYPES {
	NONE,
	APPEAL,
	JUDICIAL
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
