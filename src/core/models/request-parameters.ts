import {
	STATUS_FOLDER_NUMBER,
	RESPONSIBLE_TYPE,
	COUNT_DEADLINE,
} from "src/screen/settings/general/request-parameters/constants"
import { TUserDefault } from "./users"

export type TSelectRequestType = {
	label: string;
	responsibleType: number;
	statusFolderNumber: number;
	value: number;
}

export type TRequestParameters = {
	id?: number;
	status: boolean;
	requestType: string;
	description: string;
	statusFolderNumber: STATUS_FOLDER_NUMBER;
	requestHelp: string;
	responsibleType: RESPONSIBLE_TYPE | '';
	responsibleUserId: number | '';
	user?: TUserDefault;
	hoursDeadline: number;
	countDeadline: COUNT_DEADLINE | '';
	hasDeadline: boolean | '';
	resultReport: boolean | '';
	attachmentRequired: boolean | '';
	folderNumberRequired: boolean | '';
	processComplement: boolean | '';
	administrativeControlResponsiblesIds: number[];
	OrderById?: boolean;
	requestParameterEmailsIds?: any
}

export type TRequestParametersFilters = { requestType?: string, status?: boolean }