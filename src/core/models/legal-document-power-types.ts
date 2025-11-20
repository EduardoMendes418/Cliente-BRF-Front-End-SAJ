import { ParamsGet } from "."

export type TLegalDocPowerType = {
	id?: number
	name: string
	isActive: boolean
}

export type TLegalDocPowerTypeFilter = {
	name?: string
} & ParamsGet
