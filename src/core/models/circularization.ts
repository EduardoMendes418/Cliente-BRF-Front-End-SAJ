export type TCircularizationRequestParams = {
	page?: number;
	pageSize?: number;
}

export interface TCircularization {
	dejurAreaId: number;
	provisionTolerancePercentage: number;
	approvalProcessType: string;
	maintenanceDate: string;
	userUpdatedId: number;
	isActive: boolean;
	dejurArea?: null;
	userUpdated?: null;
	logs?: (Logs)[] | null;
	createdDate: string;
	createdBy: string;
	updatedDate: string;
	updatedBy: string;
	isDeleted: boolean;
	id: number;
}

export interface Logs { 
	id: number;
	logDataFromId: number;
	requestId: number;
	userName: string;
	occurrenceDate: string;
	statusApprovalId: number;
	statusFlowId: number;
	dueDate?: null;
	observation: string;
	rejectionAndReturnReasonsId?: null;
	userId: number;
	user?: null;
  }
  