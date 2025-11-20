import { ParamsGet } from 'src/core/models';

export type TAccountType = {
	id?: number;
	description?: string;
	status?: boolean;
}

export type TAccountTypeFilter = ParamsGet & TAccountType