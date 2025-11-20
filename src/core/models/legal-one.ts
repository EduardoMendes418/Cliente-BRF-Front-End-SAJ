import { TContact } from "./contacts"
import { TCity } from "./state-city"
import { TUserRequest } from "./users"

export type TIndividual = {
	id?: number
	identificationNumber?: string
	name: string
	addresses?: TAddress[]
	user?: TUserRequest
	contact?: TContact
}

export type TIndividualFilter = {
	id?: number
	name?: string
	cpf?: string
	supplierCode?: string
	contributorId?: string
	page?: number
	pageSize?: number
}

export type TCompany = {
	id?: number
	identificationNumber?: string
	name: string
	addresses?: TAddress[]
}

export type TCompanyFilter = {
	id?: number
	name?: string
	cpf?: string
	supplierCode?: string
	page?: number
	pageSize?: number
}

export type TAddress = {
	id?: number
	addressLine1?: string
	areaCode?: string
	isMainAddress?: boolean
	cityId?: number
	addressNumber?: string
	neighborhood?: string
	city?: TCity
}