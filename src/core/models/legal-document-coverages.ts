import { ParamsGet } from "."

export type TLegalDoc = {
	id?: number
	name: string
	isActive: boolean
}

export type TLegalDocFilter = {
	name?: string
} & ParamsGet
