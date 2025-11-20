import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "src/core/api/legal-one";
import { TContact } from "src/core/models/contacts";
import { TCompany, TIndividual } from "src/core/models/legal-one";
import { TUserRequest } from "src/core/models/users";
import { RootState } from "../..";
import { fetchContactsWithLike } from "../contacts/thunks";
import { fetchUsers } from "../users/thunks";

export const fetchIndividualsByCpf = createAsyncThunk(
	"legalOne/fetchIndividualsByCpf",
	async (cpf: string, { rejectWithValue, getState, dispatch }) => {
		try {
			const state = getState() as RootState

			const individual = state.legalOne.individuals.find(x => x.identificationNumber === cpf)

			if (individual) {
				return state.legalOne.individuals
			}

			const response = await api.findIndividuals({
				cpf
			})

			const data: TIndividual = response.data.items[0]

			const { meta: userMeta, payload: userPayload } = await dispatch(fetchUsers({ name: data.name }))

			if (userMeta.requestStatus === "fulfilled") {
				const user: TUserRequest = (userPayload as {
					items: TUserRequest[]
				}).items[0]

				data.user = user
			}

			const { meta: contactMeta, payload: contactPayload } = await dispatch(fetchContactsWithLike({ partName: data.name }))

			if (contactMeta.requestStatus === "fulfilled") {
				const contact: TContact = (contactPayload as {
					items: TContact[]
				}).items[0]

				data.contact = contact
			}

			return [...state.legalOne.individuals, data]
		} catch (error: any) {
			return rejectWithValue(error.response.data)
		}
	}
)

export const createOrUpdateIndividual = createAsyncThunk(
	"legalOne/createOrUpdateIndividual",
	async (values: TIndividual, { rejectWithValue }) => {
		const data = {
			...values,
			user: undefined,
			contact: undefined
		}

		try {
			await api.createOrUpdateIndividuals(data)
		} catch (error: any) {
			return rejectWithValue(error.response.data)
		}
	}
)

export const fetchCompanyByCnpj = createAsyncThunk(
	"legalOne/fetchCompanyByCnpj",
	async (cnpj: string, { rejectWithValue, getState }) => {
		try {
			const state = getState() as RootState

			const companies = state.legalOne.companies.find(x => x.identificationNumber === cnpj)

			if (companies) {
				return state.legalOne.companies
			}

			const response = await api.findCompanies({
				cpf: cnpj
			})

			return [...state.legalOne.companies, response.data.items[0]]
		} catch (error: any) {
			return rejectWithValue(error.response.data)
		}
	}
)

export const createOrUpdateCompany = createAsyncThunk(
	"legalOne/createOrUpdateCompany",
	async (values: TCompany, { rejectWithValue }) => {
		const data = {
			...values
		}

		try {
			await api.createOrUpdateCompanies(data)
		} catch (error: any) {
			return rejectWithValue(error.response.data)
		}
	}
)