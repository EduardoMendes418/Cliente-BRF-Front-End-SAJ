import { TCorrectionRule } from "./correction-rule";

export type TFormulaCorrectionRule = {
	id?: number;
	formulaName: string;
	correctionRules?: TCorrectionRule[]
	status: boolean
}

export type TFormulaCorrectionRuleFilters = {
	id?: number;
	isActive?: boolean;
	isPage?: boolean;
}