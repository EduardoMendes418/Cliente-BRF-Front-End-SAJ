export enum CONFRONTER_STATUS {
	NENHUM = -1,
	REPROVADO = 0,
	PENDENTE_NIVEL_1,
	APROVADO_NIVEL_1,
	REPROVADO_NIVEL_1,
	PENDENTE_NIVEL_2,
	APROVADO_NIVEL_2,
	REPROVADO_NIVEL_2,
}

export const confronterStatusOptionsNivel1 = [
	{ value: CONFRONTER_STATUS.PENDENTE_NIVEL_1, label: 'Pendente Primeiro Nível ' },
	{ value: CONFRONTER_STATUS.APROVADO_NIVEL_1, label: 'Aprovado Primeiro Nível' },
	{ value: CONFRONTER_STATUS.REPROVADO_NIVEL_1, label: 'Reprovado Primeiro Nível' },
]
export const confronterStatusOptionsNivel2 = [
	{ value: CONFRONTER_STATUS.PENDENTE_NIVEL_2, label: 'Pendente Segundo Nível' },
	{ value: CONFRONTER_STATUS.APROVADO_NIVEL_2, label: 'Aprovado Segundo Nível' },
	{ value: CONFRONTER_STATUS.REPROVADO_NIVEL_2, label: 'Reprovado Segundo Nível' },
]

export enum CONFRONTER_PHASES {
	NIVEL_1 = 1,
	NIVEL_2
}

export const confronterPhaseOptions = [
	{ value: CONFRONTER_PHASES.NIVEL_1, label: 'Primeiro Nível' },
	{ value: CONFRONTER_PHASES.NIVEL_2, label: 'Segundo Nível' }
]
