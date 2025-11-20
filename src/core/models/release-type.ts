import { ParamsGet } from 'src/core/models';

export type TReleaseType = {
	id?: number;
	description?: string;
	status?: boolean;
}

export type TReleaseTypeFilter = ParamsGet & TReleaseType