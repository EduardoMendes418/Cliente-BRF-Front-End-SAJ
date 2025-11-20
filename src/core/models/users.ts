import { textToOptions } from "../utils/func";
import { TProfiles } from "./profiles";

export type TUserAdditionalInformation = {
	rg: string;
	cpf: string;
	oab: string;
	office: string;
	officeName: string;
	departament: string;
	location: string;
	phone: string;
	dejurArea: number[];
	responsibleArea: number[];
	dejurAreas?: string[];
	contributorId?: string;
	role?: number;
	internalLawyerId?: number | "";
	legalResponsibleId?: number | "";
	officeResponsibleId?: number | "";
	degreeOfConfidentiality?: number | "";
	rawRole?: string[]
	profileName?: string;
	responsibleAreas?: string[]
	emails?: string[];
};

export type TUserDefault = {
	id?: number;
	isActive: boolean;
	idBrf: 0;
	name: string;
	email: string;
	profileId: number | "";
	profile?: TProfiles;
	isInternal: boolean;
	isAdmin: boolean;
	lastAccess?: string
};

export type TUser = TUserAdditionalInformation & TUserDefault;

export type TUserRequest = TUserDefault & {
	usersAdditionalInformation: TUserAdditionalInformation;
};
export type TGetUsersParams = {
	id?: number;
	fragment?: string;
	contactType?: number;
	envolvedType?: number;
	typeOfLinkWithTheProcess?: number;
	notPaginate?: boolean;
	page?: number;
	pageSize?: number;
};

export type TUserFilters = {
	name?: string;
	email?: string;
	profileId?: number | "";
	cpf?: string;
	rg?: string;
	oab?: string;
	areaDejur?: number[];
	responsibleAreaId?: number[];
	isActive?: boolean | "";
	contributorId?: string;
	isAdmin?: boolean | "";
	isInternal?: boolean | ""
};

export enum USER_ROLE_FLAG {
	INTERNAL_LAWYER = 1,
	AGENT = 2,
	OFFICE_RESPONSIBLE = 4,
	LEGAL_RESPONSIBLE = 8
}

export const userRoleFlag = {
	[USER_ROLE_FLAG.INTERNAL_LAWYER]: "Advogado Interno",
	[USER_ROLE_FLAG.AGENT]: "Preposto",
	[USER_ROLE_FLAG.OFFICE_RESPONSIBLE]: "Resp. do Escritório",
	[USER_ROLE_FLAG.LEGAL_RESPONSIBLE]: "Resp. Juridico",
}

export const userRoleOptions = textToOptions(userRoleFlag)