export type TEqualizationResult = {
	id: number;
	areaId: number;
	folderNumber: string;
	processNumber: string;
	oppositePart: string;
	costCenter: string;
	equalization: boolean;
	reason: string;
}

export type TEqualizationResultList = {
	items: TEqualizationResult[],
	pageCount: number;
}

export type TEqualizationResultParams = {
	page: number;
	pageSize: number;
	equalizationId: number;
	equalization?: boolean;
};