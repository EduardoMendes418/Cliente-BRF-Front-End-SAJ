export type TError = {
	detail: string;
};

export type State = {
	list: TESocialItem[];
	item: any;
	error: TError;
	listFilters: any
};

export type TESocialAreasFilter = {
	id: number
	areaId: number
	pageSize: number
	page: number
}

export type TESocialItem = {
	areaId: number
	areaName: string
	createdDate: string
	id: number
	isActive: boolean
}

export type TESocialPayload = {
	id: number
	areaId: number
	isActive: boolean
}
