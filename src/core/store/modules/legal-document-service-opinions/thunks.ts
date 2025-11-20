import { createAsyncThunk } from '@reduxjs/toolkit'

import api from 'src/core/api/legal-document-service-opinions'
import { TLegalDocServiceOpinion, TLegalDocServiceOpinionFilter } from 'src/core/models/legal-document-service-opinions'
import { rejectNoValues } from 'src/core/utils/func'

import { actions } from '../..'

export const fetchLegalDocServiceOpinions = createAsyncThunk(
	'legalDocsServiceOpinions/fetch',
	async ({ notPaginate, ...filter }: TLegalDocServiceOpinionFilter, { rejectWithValue, dispatch }) => {
		const params = rejectNoValues(filter) as TLegalDocServiceOpinionFilter
		try {
			const response = await api.list(params)
			!notPaginate && dispatch(actions.pagination.setPageCount(
				response.data.items ? response.data.pageCount : 0
			))
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)

export const getLegalDocServiceOpinions = createAsyncThunk(
	'legalDocsServiceOpinions/get',
	async ({ id }: { id: number }, { rejectWithValue }) => {
		try {
			const response = await api.get(id)
			return response.data.items[0]
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)

export const addLegalDocServiceOpinions = createAsyncThunk(
	'legalDocsServiceOpinions/add',
	async (legalDoc: TLegalDocServiceOpinion, { rejectWithValue }) => {
		try {
			const response = await api.add(legalDoc)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)

export const editLegalDocServiceOpinions = createAsyncThunk(
	'legalDocsServiceOpinions/edit',
	async (legalDoc: TLegalDocServiceOpinion, { rejectWithValue }) => {
		try {
			const response = await api.edit(legalDoc)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)

export const excludeLegalDocServiceOpinions = createAsyncThunk(
	'legalDocsServiceOpinions/exclude',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await api.delete(id)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)
