import { FOLDER_OPTIONS } from "src/core/models/data-import"
/** Change each property to optional and removes null || '' from each property */
type OnlySettedValues<T> = {
	[P in keyof T]+?: Exclude<T[P], '' | null>
}

export type TSmartSwapFilterForm = {
	originAreaId: number[],
	legalDepartmentAreaId: number[],
	foldersNumber: string | null,
	distributionDateStart: string | null,
	distributionDateEnd: string | null,
	creationDateStart: string | null,
	creationDateEnd: string | null,
	closingDateStart: string | null,
	closingDateEnd: string | null,
	terminationDateStart: string | null,
	terminationDateEnd: string | null,
	registrationComplementDateStart: string | null,
	registrationComplementDateEnd: string | null,
	result: string[],
	contingency: string[],
	statusId: number[] | '',
	type: string[],
	stateId: number | '' | null,
	cityId: number | '',
	JurisdictionsIds: number[],
	LocationIds: number[],
	AgentIds: number[],
	InternalLawyerIds: number[],
	LegalResponsibleIds: number[],
	responsibleAreaId: number[] | [],
	ResponsibleOfficeIds: number[],
	phasesId: number[] | [],
	actionClassId: number[] | [],
	provisionClassId: number[] | [],
	closureId: number[] | [],
	CostCenters: string[],
	OriginCostCenterIds: number[],
	sphere: string[],
	businessAreaId: number[] | [],
	categorySpeciesId: number[] | [],
	valuedProcess: boolean | '',
	litigationRelationship: FOLDER_OPTIONS | '',
	justiceIds: number | '' | null
}

export type TSmartSwapFilter = OnlySettedValues<TSmartSwapFilterForm>

export type TSmartSwapChangingParamsForm = {
	processIds?: number[],
	agentId: number | '';
	InternalLawyerId: number | '';
	legalResponsibleId: number | '';
	responsibleAreaId: number | '',
	responsibleOfficeId: number | '';
	statusId: number[] | '';
	terminationDate: string | null;
	closingDate: string | null;
	result: number | '',
	phasesId: number | '';
	actionClassId: number | '',
	provisionClass: number | '';
	businessArea: number | '';
	categorySpecies: number | '';
	closure: string | '';
	valuedProcess: boolean | '';
	groupingCostCenterId: string | '';
	costCenter: string | '';
}

export type TSmartSwapChangingParams = OnlySettedValues<TSmartSwapChangingParamsForm>

export type TSmartSwapItem = {
	originAreaId: number;
	legalDepartmentAreaId: number;
	distributionDate: string;
	creationDate: string;
	registrationComplementDate: string;
	closingDate: string;
	terminationDate: string;
	result: number;
	responsibleAreaId: number;
	actionClassId: number;
	statusId: number;
	phasesId: number;
	costCenter: string;
	agentId: number;
	legalResponsibleId: number;
	InternalLawyerId: number;
	responsibleOfficeId: number;
	closure: number;
	businessArea: number;
	categorySpecies: number;
	provisionClass: number;
	contingency: number;
	type: string;
	city: number;
	jurisdictionId: number;
	locationId: number;
	sphere: number;
	valuedProcess: boolean | null;
	jurisdictionsName: string,
	locationName: string,
	agentName: string,
	intenalLawerName: string,
	legalResponsibleName: string,
	responsibleAreaName: string,
	responsibleOfficeName: string,
}