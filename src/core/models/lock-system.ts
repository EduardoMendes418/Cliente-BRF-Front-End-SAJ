export type LockSystem = {
	id: number;
	startDate: string;
	endDate: string;
	message: string;
	isActive: boolean;
	isDeleted: boolean;
	createdDate?: string;
	createdBy?: string;
	updatedDate?: string;
	updatedBy?: string;
	userProfileIds: number[];
};
