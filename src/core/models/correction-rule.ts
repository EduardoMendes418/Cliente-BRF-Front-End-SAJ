import { VALUE_TYPE } from "src/screen/settings/constants";
import { ParamsGet } from ".";
import { TFormulaCorrectionRule } from "./formula-correction-rule";

export type TCorrectionRule = {
	id?: number;
	economicIndicesId: number | '';
	correctionStart: string | null;
	correctionEnd: string | null;
	feesStart: string | null;
	feesEnd: string | null;
	feesValue: number;
	fineType: VALUE_TYPE | '';
	fineValue: number | null;
	formulaCorrectionRuleId: number;
	formulaCorrectionRule?: TFormulaCorrectionRule
	status?: boolean;
}

export type TCorrectionRuleItem = TCorrectionRule & { submitAction?: 'add' | 'edit' | 'delete' };

export type TSubmitCorrectionRules = {
	itemsToAdd?: TCorrectionRule[];
	itemsToEdit?: TCorrectionRule[];
	itemsToDelete?: TCorrectionRule[];
}

export type TCorrectionRuleFilters = {
	formulaCorrectionRuleId?: number | '';
}

export type TCorrectionRuleParams = TCorrectionRuleFilters & ParamsGet;