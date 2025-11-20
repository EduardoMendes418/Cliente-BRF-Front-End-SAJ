export type TESocialRegistrationTables = {
	id: number,
	code?: number,
	description: string,
	status: boolean,
	eSocialTableId?: number
}

export type TESocialRegistrationGroup = {
	id: number,
	code?: number,
	description: string,
	status: boolean,
}

export type TESocialReasonsForDismissal = TESocialRegistrationTables & {
	startDate: string,
	endDate: string,
	eSocialTableId: number,
	eSocialReasonsForDismissalWorkerCategories: any[]
}

export type TESocialWorkerCategories = TESocialRegistrationTables & {
	eSocialGroupId: number,
	eSocialGroup: {
		id: number,
		description: string,
		status: boolean,
		eSocialWorkerCategories: any[]
	}
}

export type TTableGridList = {
	id?: number,
	eSocialTableNumber: number,
	description: string,
	status?: boolean,
	eSocialRegistrationTables?: TESocialRegistrationTables[],
	eSocialReasonsForDismissal?: TESocialReasonsForDismissal[],
	eSocialWorkerCategories?: TESocialWorkerCategories[]
}

export type TGroupGridList = {
	id?: number,
	description: string,
	status?: boolean,
	eSocialRegistrationTables?: TESocialRegistrationTables[],
	eSocialReasonsForDismissal?: TESocialReasonsForDismissal[],
	eSocialWorkerCategories?: TESocialWorkerCategories[]
}

export type TEventGridList = {
	id?: number,
	description: string,
	code?: string,
	status?: boolean,
	automaticSend?: boolean,
}

export type TSearchTable = {
	eSocialTableNumber?: string,
	tableId?: string,
	description?: string,
	id?: number | string,
	status?: boolean,
	pageSize?: number,
	page: number
}
export type TSearchGroup = {
	description?: string,
	id?: number | string,
	status?: boolean,
	pageSize?: number,
	page: number
}

export type TSearchEvent = {
	description?: string,
	code?: string,
	id?: number | string,
	status?: boolean,
	pageSize?: number,
	page: number
	folderNumber?: string,
}