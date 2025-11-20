import { textToOptions } from "src/core/utils/func"

enum PENSION_STATUS {
	ACTIVE = 1,
	SUSPENDED = 2,
	REGRESSION = 3,
	WRITE_OFF = 0
}

export const pensionStatusAsOptions = [
	{ label: 'Ativo', value: PENSION_STATUS.ACTIVE },
	{ label: 'Suspenso', value: PENSION_STATUS.SUSPENDED },
	{ label: 'Regressão', value: PENSION_STATUS.REGRESSION },
	{ label: 'Baixado', value: PENSION_STATUS.WRITE_OFF },
]

enum REQUEST_STATUS {
	DEAD,
	ACTIVE,
	SUSPENSION
}

export const requestStatusText = {
	[REQUEST_STATUS.DEAD]: 'Baixado',
	[REQUEST_STATUS.ACTIVE]: 'Ativo',
	[REQUEST_STATUS.SUSPENSION]: 'Suspenso',
} as any

export const requestStatusAsOptions = [
	{ label: 'Baixado', value: REQUEST_STATUS.DEAD },
	{ label: 'Ativo', value: REQUEST_STATUS.ACTIVE },
	{ label: 'Suspenso', value: REQUEST_STATUS.SUSPENSION },

]

export enum REQUEST_STATUS_FLOW {
	NONE = -1,
	REJEITADO = 0,
	APROVACAO_ADVOGADO_INTERNO = 1,
	DEVOLVER = 2,
	APROVACAO_GESTOR = 3,
	APROVACAO_INTERNA = 4,
	MORTO = 10
}

export const requestStatusFlowText = {
	[REQUEST_STATUS_FLOW.NONE]: 'Solicitado',
	[REQUEST_STATUS_FLOW.REJEITADO]: 'Reprovado',
	[REQUEST_STATUS_FLOW.DEVOLVER]: 'Devolvido',
	[REQUEST_STATUS_FLOW.APROVACAO_ADVOGADO_INTERNO]: 'Aprovado Advogado Interno',
	[REQUEST_STATUS_FLOW.APROVACAO_GESTOR]: 'Aprovado pelo Gestor',
	[REQUEST_STATUS_FLOW.APROVACAO_INTERNA]: 'Validado Controle Jurídico',
	[REQUEST_STATUS_FLOW.MORTO]: 'Baixado'
} as any

export const requestStatusFlowAsOptions = textToOptions(requestStatusFlowText);