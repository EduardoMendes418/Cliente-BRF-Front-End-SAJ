export enum ORDER_STATUS {
	PENDENTE = 1,
	APROVADO,
	REPROVADO,
}

export enum ORDER_EXPECTATIONS {
	PERDA = 1,
	GANHO,
}

export enum ORDER_PROBABILITIES {
	PROBABLE = 1,
	POSSIBLE,
	REMOTE,
}

/** index + 1 is expected to match ORDER_PROBABILITIES constant */
export const PROBABILITY_TYPE_CAMEL = ['probable', 'possible', 'remote'] as const

/** index + 1 is expected to match ORDER_PROBABILITIES constant */
export const PROBABILITY_TYPE_PASCAL = ['Probable', 'Possible', 'Remote'] as const

export const orderChangableProperties = ['orderDescriptionId', 'orderExpectationId', 'orderProbabilityId',
'orderStatusId', 'isActive', 'createdDate', 'orderRatings', 'orderFiles']

export const orderRatingsChangableProperties = ['orderRatingDescriptionId', 'probableValue', 'possibleValue',
'remoteValue', 'riskValue', 'dataBase', 'formulaCorrectionRuleId' ]

export enum SUBMITION_TYPE {
	ORDER = 'ORDER',
	ORDER_RATING = 'ORDER_RATING',
}

export enum CONTINGENCY {
	PASSIVA = 'Passiva',
	ATIVA = 'Ativa',
	SEM_CONTINGENCIA = 'semContingencia'
}

export const CLASSIC_PROVISION_CLASS = 'CLÁSSICO'

export const TStatusFlowConfronting = [
	{
		id: -1,
		t: "Nenhum",
		level: 0,
	},
	{
		id: 0,
		t: "Confrontador Reprovado",
		level: 0,
	},
	{
		id: 1,
		t: "Enviado Confrontador",
		level: 0,
	},
	{
		id: 2,
		t: "Confrontador Aprovado",
		level: 1,
	},
	{
		id: 3,
		t: "Confrontador Reprovado",
		level: 1,
	},
	{
		id: 4,
		t: "Pendente Nível 2",
		level: 2,
	},
	{
		id: 5,
		t: "Confrontador Aprovado",
		level: 2,
	},
	{
		id: 6,
		t: "Confrontador Reprovado",
		level: 2,
	},
	{
		id: 7,
		t: "Erro Aprovação",
		level: 2,
	},
	{
		id: 9,
		t: "Não confrontável",
		level: null,
	},
]

export enum PROCESS_TYPE {
	JUDICIAL = "Judicial",
	ADMINISTRATIVO = "Administrative",
}

export const processTypeOptions = [
	{ label: "Administrativo", value: PROCESS_TYPE.ADMINISTRATIVO },
	{ label: "Judicial", value: PROCESS_TYPE.JUDICIAL },
];
