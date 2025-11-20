export type SmartSwapChangesProcess = {
	id: number;
	smartSwapChangesId: number;
	processId: number;
	folderNumber: string;
	statusExecution: number;
	statusExecutionDescription: string;
	startExecution: string;
	endExecution: string;
	message: string;
	fromToChangedFields: string;
};

export type SmartSwapExecution = {
	id: number;
	smartSwapId: string;
	statusExecution: number;
	statusExecutionDescription: string;
	startExecution: string;
	endExecution: string;
	rows: number;
	requesterUserId: number;
	requesterUserName: string;
	smartSwapData: string;
	smartSwapChangesProcesses: SmartSwapChangesProcess[] | null;
};
export type SmartSwapChangesResponse = {
	items: SmartSwapExecution[];
	page: number;
	itemCount: number;
	itemsPerPage: number;
	pageCount: number;
  };
  

export type SmartSwapChangesParameters = {
	statusExecutionSmartSwap?: number | null;
	statusExecutionSmartSwapProcess?: number | null;
	folderNumber?: string;
	page?: number;
	pageSize?: number;
};

export type StatusExecutionSmartSwap = {
	key: number;
	value: string;
};
