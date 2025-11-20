import { ParamsGet } from 'src/core/models';

export type TOrderStatus = {
	id?: number,
	name: string,
	isActive?: boolean
}

export type TOrderStatusFilter = ParamsGet & {
	partName?: string
	isActive?: boolean
}
