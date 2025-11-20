export const radioOption = [
	{ label: 'Sim', value: true },
	{ label: 'Não', value: false },
];

export enum STATUS_BC {
	NONE = -1,
	DISABLED,
	ACTIVE,
}
export const statusTexBC = {
	[STATUS_BC.DISABLED]: 'Desativado',
	[STATUS_BC.ACTIVE]: 'Ativo',
}