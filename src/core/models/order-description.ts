import { ParamsGet } from 'src/core/models';
import { TArea } from './areas'

export type TOrderDescription = {
	id?: number,
	name: string,
	areaId?: number,
	area?: TArea,
	isActive?: boolean,
	sumProvision?: boolean
}

export type TOrderDescriptionFilter = ParamsGet & {
	partName?: string,
	areaId?: number | '',
	isActive?: boolean
}