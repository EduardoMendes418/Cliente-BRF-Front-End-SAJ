import { TRequestParameters } from './request-parameters'
import { ATTACHMENT_TYPE, STATUS } from 'src/screen/requisitions/constants'
import { ParamsGet } from '.';
import {
	TLogs
} from 'src/core/models';

export type TAttachedFile = {
	id: number;
	idRequest: number;
	documentName: string;
	path: string;
};

export type FolderNumber = {
	folderNumber: string;
}

export type TRequisitionForm = {
	id?: number;
	status: STATUS;
	requestDate: string;
	forwardAttachmentEmail: boolean;
	administrativeControlResponsiblesIds?: number[] | undefined;
	emailsWithExternallCopies: string;
	emailsWithInternalCopies: string;
	responsibleName?: string;
	requestParameterId?: number;
	expectedServiceDate?: string;
	files?: FileList;
	serviceFiles?: FileList;
	folderNumbers: FolderNumber[];
	resultReport: number | '';
	isService?: boolean;
	type?: ATTACHMENT_TYPE;
}


export type TRequisition = {
	requesterName?: string;
	requesterEmail: string;
	id?: number;
	status: STATUS;
	statusId?: number;
	requestDate: string;
	expectedServiceDate: string;
	forwardAttachmentEmail: boolean;
	emailsWithExternallCopies: string;
	emailsWithInternalCopies: string;
	folderNumber?: string;
	files?: FileList;
	requestParameter: TRequestParameters;
	resultReport: number;
	responsibleName: string;
	responsibleUserId: number;
	dejurAreaId: number;
	administrativeControlResponsiblesIds?: number[];
	administrativeControlResponsiblesNames?: any[];
	logs?: TLogs[];
	createdBy: string;
	serviceUser?: { name: string, email: string };
	serviceUserName?: string;
	responsiblesInService: string[]
}

export type TRequisitionFiles = {
	id: number;
	idRequest: number;
	documentName: string;
	path: string;
};

export type TServiceUser = {
	email: string;
	id: number;
	name: string;
}

export type TRequisitionsFilters = ParamsGet & {
	folderNumber?: string;
	requestDateBegin?: string | null;
	requestDateEnd?: string | null;
	responsibleUserId?: string[] | number[] | string | number | null;
	status?: STATUS[] | '';
	requestDate?: string | null;
	requestUserName?: string[] | null | string;
	areaId?: number | '';
	requestParameterId?: number | '';
	expectedServiceDate?: number | null;
	ConclusionDate?: string | null;
	ConclusionDateEnd?: string | null;
	serviceRequisition?: boolean;
	filterServiceTeam?: boolean;
	isAdmin?: boolean;
};

export type TRequisitionsFiltersMultiple = ParamsGet & {
	folderNumber?: string;
	requestDateBegin?: string | null;
	requestDateEnd?: string | null;
	responsibleUserId?: number | "" | never[];
	status?: "" | STATUS | STATUS[] | never[];
	requestDate?: string | null;
	requestUserName?: string[] | null | string;
	areaId?: number | "" | never[];
	requestParameterId?: number | "" | never[];
	ExpectedServiceDate?: number | null;
	ConclusionDate?: string | null;
	ConclusionDateEnd?: string | null;
	serviceRequisition?: boolean;
	filterServiceTeam?: boolean;
	RequestParameterIds?: any[];
	RequestStatusIds?: [];
	AdministrativeControlResponsiblesIds?: [];
	administrativeControlResponsiblesNames?: [];
	LegalDepartmentAreaIds?: [];
	serviceUserId?: string[] | null | string,
	folderNumbers?: [];
	litigationRelationship?: number | null;
	statusId?: any[];
	internalLawyer?: number | '';
};

export type TRequisitionService = TRequisition & {
	conclusionDate: string | null;
	observation: string;
	isAttachmentLegalOne: boolean | '';
	serviceUser?: TServiceUser | null;
	serviceUserName?: string | null;
	serviceUserId?: number | null;
	serviceFiles?: FileList;
	emailsWithInternalCopiesMultiple?: string[];
	justificationDisapproval?: string | null;
	description?: string | null;
	initialStatus?: number | null;
	sigthObservation?: string;
	isService?: boolean;
	sapActiveCostCenter?: string | null;
	complainant?: boolean | '';
	cpf?: string | null;
	dateOfBirth?: Date | null;
	dateOfAdmission?: Date | null;
	dateOfDismissal?: Date | null;
	position?: string | null;
	salary?: number | null;
	ctpsNumber?: string | null;
	seriesNumber?: string | null;
	pisPasep?: string | null;
	type?: ATTACHMENT_TYPE;
}

export type TUpdateStatus = {
	id: number;
	status?: STATUS;
	generateLog?: boolean;
}
