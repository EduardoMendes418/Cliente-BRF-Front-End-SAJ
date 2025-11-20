import { ParamsGet } from 'src/core/models';

export type TExplanatoryNote = {
	id?: number;
	description?: string;
	reference?: string;
	status?: boolean;
}

export type TExplanatoryNoteFilter = ParamsGet & TExplanatoryNote
