import { FOLDER_STATUS } from "../../screen/settings/constants";

export type TCivilMass = {
	id?: number;
	name: string;
	value: number;
	createdDate?: string | null;
	folderStatus: FOLDER_STATUS.ACTIVE | FOLDER_STATUS.TEMPORARY_WRITE_OFF | '';
	dejurArea: number | '';
	isActive: boolean;
	orderDescriptionId: number | '';
	orderProbabilityId: number | '';
	orderRatingDescriptionId: number | '';
	formulaCorrectionRuleId: number | '';
}

export type TCivilMassParams = Partial<TCivilMass> & {
	page: number;
	pageSize: number;
};