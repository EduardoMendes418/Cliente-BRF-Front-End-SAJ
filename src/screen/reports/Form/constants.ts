export enum CONTACT_TYPE {
	PERSON = 1,
	COMPANY
}

enum FOLDER_OPTION {
	MAIN = 1
}

export enum REQUEST_PROVISION_OPTION {
	SYNTHETIC = 1,
	ANALYTICAL
}

export const folderOptionsAsOptions = [
	{ label: 'Principal', value: FOLDER_OPTION.MAIN, },
]

export const requestProvisionOptions = [
	{ label: 'Sintético', value: REQUEST_PROVISION_OPTION.SYNTHETIC },
	{ label: 'Analítico', value: REQUEST_PROVISION_OPTION.ANALYTICAL },
]

export const statusOptions = [
	{ label: 'Ativo', value: 1 },
	{ label: 'Morto', value: 2 }
]
