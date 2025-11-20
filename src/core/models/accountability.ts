export type TAccountabilitySapResponseFilter = {
	type?: string;
	accountabilityId?: number;
	folderNumber?: string
	goodsGuaranteesRequestId?: number
};

export type TAcconting = {
	accountabilityId: number
	company: string
	createdDate: Date
	documentNumber: string
	exercice: string
	folderNumber: string
	message: string
	messageType: string
	releaseDate: Date
}