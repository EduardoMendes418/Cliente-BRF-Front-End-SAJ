import { createAsyncThunk } from '@reduxjs/toolkit'

import api from 'src/core/api/legal-document-grants'
import { TLegalDocGrants, TLegalDocGrantsFilter } from 'src/core/models/legal-document-grants'
import { rejectNoValues } from 'src/core/utils/func'

import { actions } from '../..'

export const fetchLegalDocGrants = createAsyncThunk(
	'legalDocGrants/fetch',
	async ({ notPaginate, ...filter }: TLegalDocGrantsFilter, { rejectWithValue, dispatch }) => {
		const params = rejectNoValues(filter) as TLegalDocGrantsFilter
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

export const getLegalDocGrants = createAsyncThunk(
	'legalDocGrants/get',
	async ({ id }: { id: number }, { rejectWithValue }) => {
		try {
			const response = await api.get(id)
			return response.data.items[0]
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)

export const addLegalDocGrants = createAsyncThunk(
	'legalDocGrants/add',
	async (legalDoc: TLegalDocGrants, { rejectWithValue }) => {
		try {
			const response = await api.add(legalDoc)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)

export const editLegalDocGrants = createAsyncThunk(
	'legalDocGrants/edit',
	async (legalDoc: TLegalDocGrants, { rejectWithValue }) => {
		try {
			const response = await api.edit(legalDoc)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)

export const excludeLegalDocGrants = createAsyncThunk(
	'legalDocGrants/exclude',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await api.delete(id)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)
