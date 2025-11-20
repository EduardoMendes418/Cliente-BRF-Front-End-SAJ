export type TCostCenter = {
	id: number;
	description: string;
	costCenter: string;
};

export type TCostCenterWithLikeParams = {
	id?: number;
	costCenter?: string;
}
