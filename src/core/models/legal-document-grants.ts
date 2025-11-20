import { ParamsGet } from "."

export type TLegalDocGrants = {
	id?: number
	name: string
	isDeleted: boolean
	mandatoryCorrespondentData: boolean
}

export type TLegalDocGrantsFilter = {
	name?: string
	mandatoryCorrespondentData?: boolean
} & ParamsGet