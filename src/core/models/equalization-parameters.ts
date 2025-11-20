import { CONTINGENCY_TYPE, FOLDER_STATUS } from "src/screen/settings/constants";
import { ParamsGet, TDejurAreaFilter } from ".";

export type TEqualizationParameters = {
	id?: number;
	areaId: number | '';
	folderStatus: FOLDER_STATUS;
	contingencyType: CONTINGENCY_TYPE;
	days: number | '';
	formulaCorrectionRuleId: number | '';
	isActive: boolean;
	runEqualization: boolean;
	isRunning?: boolean;
	checked?: boolean;
	endProcessing?: string | '';
}

export type TEqualizationParametersParams = TDejurAreaFilter & ParamsGet & { isActive?: boolean };

export const renameFilterProps = { dejurArea: 'areaId' };
