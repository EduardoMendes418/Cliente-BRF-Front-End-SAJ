import { TEqualizationParameters } from "./equalization-parameters";
import { ParamsGet } from ".";
import { TUserDefault } from "./users";

export type TEqualization = TEqualizationParameters & {
	id: number;
	startProcessing: string;
	endProcessing: string;
	requestingUser: number;
	requestingUserObject: TUserDefault;
}

export type TEqualizationFilters = {
	areaId?: number | '';
	createStart?: string | null;
	createEnd?: string | null;
	userId?: number | '';
}

export type TEqualizationParams = TEqualizationFilters & ParamsGet;