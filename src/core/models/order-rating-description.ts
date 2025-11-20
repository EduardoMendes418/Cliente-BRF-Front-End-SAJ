import { ParamsGet } from 'src/core/models';

export type TOrderRatingDescription = {
	id?: number,
	name: string,
	orderById?: number,
	isActive?: boolean
}

export type TOrderRatingDescriptionFilter = ParamsGet & {
	partName?: string
	isActive?: boolean
}
