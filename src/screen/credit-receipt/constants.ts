import { getOptionsAsObject } from "src/core/utils/func";

export enum STATUS_CREDIT_RECEIPT {
	NONE = -1,
	REQUESTED = 3,
	FOR_WITHDRAWAL = 9,
	DEAD = 10,
	REVERSED = 11,
	RETURNED_LEGAL = 12,
	RETURNED_ANALYSIS = 13,
	RETURNED_OFFICE = 14,
	REJECTED = 15
}

export const statusOptions = [
	{ value: STATUS_CREDIT_RECEIPT.REQUESTED, label: 'Pendente' },
	{ value: STATUS_CREDIT_RECEIPT.FOR_WITHDRAWAL, label: 'Para saque' },
	{ value: STATUS_CREDIT_RECEIPT.DEAD, label: 'Morto' },
	{ value: STATUS_CREDIT_RECEIPT.REVERSED, label: 'Estornado' },
	{ value: STATUS_CREDIT_RECEIPT.RETURNED_LEGAL, label: 'Devolvido jurídico' },
	{ value: STATUS_CREDIT_RECEIPT.RETURNED_ANALYSIS, label: 'Devolvido análise' },
	{ value: STATUS_CREDIT_RECEIPT.RETURNED_OFFICE, label: 'Devolvido escritório' },
	{ value: STATUS_CREDIT_RECEIPT.REJECTED, label: 'Reprovado' },
];
export const statusOptionsPendente = [
	{ value: STATUS_CREDIT_RECEIPT.DEAD, label: 'Morto' },
	{ value: STATUS_CREDIT_RECEIPT.REJECTED, label: 'Reprovado' },
	{ value: STATUS_CREDIT_RECEIPT.FOR_WITHDRAWAL, label: 'Para saque' },
	{ value: STATUS_CREDIT_RECEIPT.RETURNED_LEGAL, label: 'Devolvido jurídico' },
	{ value: STATUS_CREDIT_RECEIPT.RETURNED_ANALYSIS, label: 'Devolvido análise' },
	{ value: STATUS_CREDIT_RECEIPT.RETURNED_OFFICE, label: 'Devolvido escritório' },
];
export const statusOptionsSaque = [
	{ value: STATUS_CREDIT_RECEIPT.DEAD, label: 'Morto' },
	{ value: STATUS_CREDIT_RECEIPT.RETURNED_LEGAL, label: 'Devolvido jurídico' },
	{ value: STATUS_CREDIT_RECEIPT.RETURNED_ANALYSIS, label: 'Devolvido análise' },
	{ value: STATUS_CREDIT_RECEIPT.RETURNED_OFFICE, label: 'Devolvido escritório' },
];
export const statusOptionsMorto = [
	{ value: STATUS_CREDIT_RECEIPT.REVERSED, label: 'Estornado' },
];

export const allStatusOptions = [
	{ value: STATUS_CREDIT_RECEIPT.NONE, label: 'Pendente' },
	...statusOptions
]

export const statusText = { ...getOptionsAsObject(allStatusOptions) }

export const RETURNED_STATUS = [
	STATUS_CREDIT_RECEIPT.RETURNED_ANALYSIS,
	STATUS_CREDIT_RECEIPT.RETURNED_OFFICE,
	STATUS_CREDIT_RECEIPT.RETURNED_LEGAL,
];
