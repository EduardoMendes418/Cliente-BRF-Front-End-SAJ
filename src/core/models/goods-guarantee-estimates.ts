export type TBudgetFile = {
	isMainFile: boolean;
	file: any;
}

export type TBudget = {
	id: number;
	insuranceCompanyName: string;
	insuranceCompanyId: number | "";
	requestDate: string | null;
	observation: string;
	description: string;
	description02: string;
	description03: string;
	description04: string;
	files: TBudgetFile[];
	isApproved: boolean;
	isSelected?: boolean;
}

export type TAddBudget = {
	goodsGuaranteesRequestId: number;
	statusFlowId: number;
	estimates: TBudget[];
	guaranteeModalityId?: number | "";
	observation?: any;
}

export type TEditBudget = {
	goodsGuaranteesRequestId: number;
	budget: TBudget;
}

export type TAddFiles = {
	id: number;
	isMainFile: boolean;
	files: FileList;
}
