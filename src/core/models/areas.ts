export type TArea = {
	id: number;
	name: string;
	path: string;
	type: number;
	subgroup?: boolean;
	parentAreaId?: number;
};

export type TGroupedArea = {
  id: number;
  name: string;
  parentAreaId: number | null;
  path: string;
  source: string;
  subGroup: boolean;
  subItens: any[]
  type: number;
}

export type TUseAreasByUserId = {
	listDEJURbyUser: TAreaByUser
	listDEJURbyUserOptions: TOptions[]
}

export type TAreaByUser = {
	areasDejur: IAreasDejur[] | null
	responsibleAreaIds: IResponsibleAreaIds[] | null
	message: string
}

export interface IAreasDejur { 
  id: number;
  name: string;
  source?: null;
  legalEntityId?: null;
  legalDepartmentId?: null;
  parentAreaId: number;
  type: number;
  allocateData: boolean;
  allocatePeople: boolean;
  allocateFinancialClassifications: boolean;
  path: string;
  createdDate: string;
  createdBy?: null;
  updatedDate?: null;
  updatedBy?: null;
  isDeleted: boolean;
}

export interface IResponsibleAreaIds { 
  id: number;
  name: string;
  source?: null;
  legalEntityId?: null;
  legalDepartmentId?: null;
  parentAreaId: number;
  type: number;
  allocateData: boolean;
  allocatePeople: boolean;
  allocateFinancialClassifications: boolean;
  path: string;
  createdDate: string;
  createdBy?: null;
  updatedDate?: null;
  updatedBy?: null;
  isDeleted: boolean;
}

type TOptions = {
	label: string
	value: number | string
}
