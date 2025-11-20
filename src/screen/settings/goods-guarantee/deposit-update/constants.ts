export enum DEPOSIT_STATUS {
	ACTIVE = 1,
	SUSPENDED
}

export const depositStatusAsOptions = [
	{ label: 'Ativo', value: DEPOSIT_STATUS.ACTIVE },
	{ label: 'Inativo', value: DEPOSIT_STATUS.SUSPENDED }
]