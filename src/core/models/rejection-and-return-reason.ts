import { ParamsGet } from "."
import { REASON_TYPE } from "src/screen/settings/general/evaluation-reason/constants";

export type TRejectionAndReturnReason = {
	id?: number;
	reasonType: REASON_TYPE | '',
	description: string;
	status: boolean;
	moduloId: number | ""
}

export type TRejectionAndReturnReasonFilters = {
	reasonType?: REASON_TYPE | '';
	description?: string;
	status?: boolean;
	moduloId?: number;
}

export type TRejectionAndReturnReasonParams = ParamsGet & TRejectionAndReturnReasonFilters;