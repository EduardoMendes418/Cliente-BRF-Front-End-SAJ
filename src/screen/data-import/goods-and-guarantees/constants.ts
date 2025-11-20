import { TOptionsSelect } from "src/components/form";
import { STATUS_FOLDER_NUMBER } from "src/screen/settings/general/request-parameters/constants";

export const guaranteeStatusOptions: TOptionsSelect[] = [
	{ label: "Ativo", value: STATUS_FOLDER_NUMBER.ACTIVE },
	/* {label: "Endossado", value: STATUS_FOLDER_NUMBER.SUSPENDED},
	{label: "Não Vigente", value: STATUS_FOLDER_NUMBER.TEMPORARY_DISCHARGE}, */
	{ label: "Morto", value: STATUS_FOLDER_NUMBER.DIED }
]