import { Moment } from 'moment'
import {
	ECONOMIC_INDICES_TYPE,
	ECONOMIC_INDICES_PERIOD
} from "src/screen/settings/general/economic-indices/constants"

export type TEconomicIndicesValues = {
	id: number,
	value: number | string,
	date: string,
}

export type TEconomicIndices = {
	id?: number,
	name: string,
	period: ECONOMIC_INDICES_PERIOD,
	type: ECONOMIC_INDICES_TYPE,
	description: string,
	economicIndicesValues: TEconomicIndicesValues[]
	createdDate: Moment
	status: boolean;
}

export type TEconomicIndicesFilters = { name?: string, period?: number | '' }