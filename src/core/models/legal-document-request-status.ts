import { ParamsGet } from "."

export type TLegalDocReqStatus = {
	id?: number
	name: string
	isActive: boolean
}

export type TLegalDocReqStatusFilter = {
	name?: string
} & ParamsGet
