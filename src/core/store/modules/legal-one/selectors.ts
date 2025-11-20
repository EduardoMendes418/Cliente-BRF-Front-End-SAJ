import { createSelector } from "@reduxjs/toolkit"
import { RootState } from "../.."

const state = (state: RootState) => state.legalOne

export const getIndividualByCpf = (cpf?: string) => {
	return createSelector(
		[state],
		(state) => {
			return state.individuals.find(x => x.identificationNumber === cpf)
		}
	)
}

export const getCompanyByCnpj = (cnpj?: string) => {
	return createSelector(
		[state],
		(state) => {
			return state.companies.find(x => x.identificationNumber === cnpj)
		}
	)
}