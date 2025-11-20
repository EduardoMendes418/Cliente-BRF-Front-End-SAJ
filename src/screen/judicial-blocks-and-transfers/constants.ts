import { getOptionsAsObject } from "src/core/utils/func";

export enum STATUS_FLOW {
	PENDING_CCJ,
	PENDING_LEGAL,
	IN_VALIDATION,
	CANCELLED,
	RETURNED,
	FINISHED,
	IN_UNLOCK,
	UNLOCKED
}

const commonStatusOptions = [
	{ value: STATUS_FLOW.PENDING_CCJ, label: 'Pendente' },
	{ value: STATUS_FLOW.IN_VALIDATION, label: 'Em validação' },
	{ value: STATUS_FLOW.CANCELLED, label: 'Cancelado' },
	{ value: STATUS_FLOW.RETURNED, label: 'Devolvido' },
]

export const solicitationStatusOptionsBlock = [
	{ value: STATUS_FLOW.PENDING_CCJ, label: 'Pendente' },
	{ value: STATUS_FLOW.CANCELLED, label: 'Cancelado' },
	{ value: STATUS_FLOW.IN_VALIDATION, label: 'Em validação' },
	{ value: STATUS_FLOW.RETURNED, label: 'Devolvido' },
	{ value: STATUS_FLOW.IN_UNLOCK, label: 'Em desbloqueio' },
	{ value: STATUS_FLOW.UNLOCKED, label: 'Desbloqueado' }
]

export const solicitationStatusOptionsBlockStatus = [
	{ value: STATUS_FLOW.CANCELLED, label: 'Cancelado' },
	{ value: STATUS_FLOW.IN_VALIDATION, label: 'Em validação' },
	{ value: STATUS_FLOW.RETURNED, label: 'Devolvido' },
	{ value: STATUS_FLOW.IN_UNLOCK, label: 'Em desbloqueio' },
]

export const solicitationStatusOptionsBlockInUnlock = [
	{ value: STATUS_FLOW.IN_UNLOCK, label: 'Em desbloqueio' },
	{ value: STATUS_FLOW.CANCELLED, label: 'Cancelado' },
]

export const solicitationOnlyCanceledStatus = [
	{ value: STATUS_FLOW.CANCELLED, label: 'Cancelado' },
]

export const solicitationStatusOptionsBlockInUnlockAndGenerateGuarantee = [
	{ value: STATUS_FLOW.UNLOCKED, label: 'Desbloqueado' },
	{ value: STATUS_FLOW.CANCELLED, label: 'Cancelado' },
]

export const solicitationStatusOptionsTransfer = [
	{ value: STATUS_FLOW.PENDING_CCJ, label: 'Pendente' },
	{ value: STATUS_FLOW.CANCELLED, label: 'Cancelado' },
	{ value: STATUS_FLOW.RETURNED, label: 'Devolvido' },
	{ value: STATUS_FLOW.FINISHED, label: 'Finalizado' },
]
export const allStatusOptionsTransfer = [
	{ value: STATUS_FLOW.PENDING_CCJ, label: 'Pendente' },
	{ value: STATUS_FLOW.CANCELLED, label: 'Cancelado' },
	{ value: STATUS_FLOW.RETURNED, label: 'Devolvido' },
	{ value: STATUS_FLOW.IN_UNLOCK, label: 'Em desbloqueio' },
	{ value: STATUS_FLOW.UNLOCKED, label: 'Desbloqueado' },
	{ value: STATUS_FLOW.FINISHED, label: 'Finalizado' },
	{ value: STATUS_FLOW.IN_VALIDATION, label: 'Em validação' },
]
export const evaluationStatusOptions = [
	{ value: STATUS_FLOW.IN_VALIDATION, label: 'Em validação' },

]

export const transferStatusOptions = [
	...commonStatusOptions,
	{ value: STATUS_FLOW.FINISHED, label: 'Finalizado' },
]

export const blockStatusOptions = [
	...commonStatusOptions,
	{ value: STATUS_FLOW.IN_UNLOCK, label: 'Em desbloqueio' },
	{ value: STATUS_FLOW.UNLOCKED, label: 'Desbloqueado' }
]

export const allStatusOptions = [
	...transferStatusOptions,
	...blockStatusOptions.filter((option) => !commonStatusOptions.includes(option))
]

export const transferStatusAsObject = getOptionsAsObject(transferStatusOptions);
export const blockStatusAsObject = getOptionsAsObject(blockStatusOptions);
export const allStatusAsObject = getOptionsAsObject(allStatusOptions)

export enum OCCURRENCE_TYPE {
	NONE,
	JUDICIAL_BLOCK,
	JUDICIAL_TRANSFER
}

export const occurrenceTypesOptions = [
	{ value: OCCURRENCE_TYPE.JUDICIAL_BLOCK, label: 'Bloqueio judicial' },
	{ value: OCCURRENCE_TYPE.JUDICIAL_TRANSFER, label: 'Transferência judicial' },
]

export const occurrenceTypeAsObject = getOptionsAsObject(occurrenceTypesOptions);
