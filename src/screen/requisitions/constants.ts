export enum STATUS {
	NONE = -1,
	REJECTED_DEFINITIVE = 0,
	APPROVED_DEFINITIVE = 1,
	REQUESTED = 3,
	IN_REVIEW = 4,
	CANCELLED = 6,
	RETURNED = 7
}

export enum ATTACHMENT_TYPE {
	REQUEST = 1,
	SERVICE = 2
}

export const statusText = {
	[STATUS.REQUESTED]: 'Pendente',
	[STATUS.REJECTED_DEFINITIVE]: 'Reprovado',
	[STATUS.APPROVED_DEFINITIVE]: 'Atendido',
	[STATUS.IN_REVIEW]: 'Em atendimento',
	[STATUS.CANCELLED]: 'Cancelado',
	[STATUS.RETURNED]: "Devolvido"
} as any

export const statusTextListTreatment = {
	[STATUS.REQUESTED]: 'Pendente',
	[STATUS.REJECTED_DEFINITIVE]: 'Reprovar',
	[STATUS.APPROVED_DEFINITIVE]: 'Atender',
	[STATUS.IN_REVIEW]: 'Em atendimento',
	[STATUS.CANCELLED]: 'Cancelado',
	[STATUS.RETURNED]: 'Devolver'
} as any

export const statusTextAsOptions = [
	{ value: STATUS.APPROVED_DEFINITIVE, label: statusText[STATUS.APPROVED_DEFINITIVE] },
	{ value: STATUS.CANCELLED, label: statusText[STATUS.CANCELLED] },
	{ value: STATUS.IN_REVIEW, label: statusText[STATUS.IN_REVIEW] },
	{ value: STATUS.REQUESTED, label: statusText[STATUS.REQUESTED] },
	{ value: STATUS.REJECTED_DEFINITIVE, label: statusText[STATUS.REJECTED_DEFINITIVE] },
	{ value: STATUS.RETURNED, label: statusText[STATUS.RETURNED] }
]

export const statusTextAsOptionsTreatment = [
	{ value: STATUS.APPROVED_DEFINITIVE, label: statusTextListTreatment[STATUS.APPROVED_DEFINITIVE] },
	{ value: STATUS.IN_REVIEW, label: statusTextListTreatment[STATUS.IN_REVIEW] },
	{ value: STATUS.REQUESTED, label: statusTextListTreatment[STATUS.REQUESTED] },
	{ value: STATUS.REJECTED_DEFINITIVE, label: statusTextListTreatment[STATUS.REJECTED_DEFINITIVE] },
	{ value: STATUS.CANCELLED, label: statusTextListTreatment[STATUS.CANCELLED] },
	{ value: STATUS.RETURNED, label: statusTextListTreatment[STATUS.RETURNED] }
]

export enum TYPES_MODALS {
	WARNING,
	HELP,
}

export const modals = {
	[TYPES_MODALS.WARNING]: {
		title: "Aviso!",
		component: "Responsável pelo atendimento não ativo no sistema, favor solicitar alteração do responsável ou indique manualmente neste andamento"
	}
}