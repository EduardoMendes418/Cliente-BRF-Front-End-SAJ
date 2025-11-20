import { ParamsGet } from 'src/core/models';

export type TOrderProbability = {
	id?: number,
	name: string,
	isActive?: boolean,
	orderById?: number,
	account?: boolean,
}

export type TOrderProbabilityFilter = ParamsGet & {
	partName?: string
	isActive?: boolean
}
