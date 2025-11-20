export enum ECONOMIC_INDICES_TYPE {
	FEE = 1,
	REFERENCE = 2,
}

export enum ECONOMIC_INDICES_PERIOD {
	DAILY = 1,
	MONTHLY = 2,
	YEARLY = 3,
	COLLECTIVE_AGREEMENT = 4
}

export const periodAsOptions = [
	{ value: ECONOMIC_INDICES_PERIOD.DAILY, label: 'Diário' },
	{ value: ECONOMIC_INDICES_PERIOD.MONTHLY, label: 'Mensal' },
	{ value: ECONOMIC_INDICES_PERIOD.YEARLY, label: 'Anual' },
	{ value: ECONOMIC_INDICES_PERIOD.COLLECTIVE_AGREEMENT, label: 'Acordo Coletivo' },
];
 
export const typeAsOptions = [
	{ value: ECONOMIC_INDICES_TYPE.FEE, label: 'Taxa' },
	{ value: ECONOMIC_INDICES_TYPE.REFERENCE, label: 'Referência' },
];