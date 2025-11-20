import { ParamsGet } from 'src/core/models';

export type TComarca = {
	id: number;
	name: string;
	justiceId: number;
	stateId: number;
}

export type TComarcaFilters = ParamsGet & {
	id?: number;
	name?: string;
	justiceId?: number
	stateId?: number
}

