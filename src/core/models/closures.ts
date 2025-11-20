export type TClosures = {
	id?: number,
	period: string | null,
	status: number | '',
	startDateCompetence: string | null,
	endDateCompetence: string | null,
	dataHoraAgendamento?: any;
}

export const renameProps: { [key: string]: string | any[] } = {
	periodo: 'period',
	dataInicioCompetencia: 'startDateCompetence',
	dataFimCompetencia: 'endDateCompetence',
}

export type TReportInterestUpdatesAccountingParams = {
	referenceMonth?: string | number;
	referenceYear?: string | number;
	id?: number;
	judicialAreaIds?: number[];
	accoutingTypes?: number[];
	closureId?: number[] | null;
}

export type TGetExecutedInterestUpdatesParams = {
	juridicalAreaIds?: number[];
	competenceDate?: string;
	accountingTypeId?: number | null;
	statusApprovals?: number[];
	closureId?: number | null;
}

export type TRunInterestDepositParams = {
	date: string;
	areaDejur: string[];
	closureId: number;
}

export type TCreateInterestUpdatesForApprovalParams = {
	id: number,
	referenceDate?: string,
	juridicalAreaId?: number
}
