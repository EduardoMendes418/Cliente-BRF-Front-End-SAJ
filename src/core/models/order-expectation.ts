import { ParamsGet } from 'src/core/models';

export type TOrderExpectation = {
	id: number,
	name: string,
	isActive?: boolean
	provision?: boolean
}

export type TOrderExpectationFilter = ParamsGet & {
	partName?: string
	isActive?: boolean
}