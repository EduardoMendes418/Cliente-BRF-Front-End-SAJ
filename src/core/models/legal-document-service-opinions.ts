import { ParamsGet } from "."

export type TLegalDocServiceOpinion = {
	id?: number
	name: string
	description: string
	isActive: boolean
}

export type TLegalDocServiceOpinionFilter = {
	name?: string
} & ParamsGet
