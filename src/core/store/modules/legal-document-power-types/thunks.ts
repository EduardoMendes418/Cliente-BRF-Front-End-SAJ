import { createAsyncThunk } from '@reduxjs/toolkit'

import api from 'src/core/api/legal-document-power-types'
import { TLegalDocPowerType, TLegalDocPowerTypeFilter } from 'src/core/models/legal-document-power-types'
import { rejectNoValues } from 'src/core/utils/func'

import { actions } from '../..'

export const fetchLegalDocPowerTypes = createAsyncThunk(
	'legalDocPowerTypes/fetch',
	async ({ notPaginate, ...filter }: TLegalDocPowerTypeFilter, { rejectWithValue, dispatch }) => {
		const params = rejectNoValues(filter) as TLegalDocPowerTypeFilter
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

export const getLegalDocPowerTypes = createAsyncThunk(
	'legalDocPowerTypes/get',
	async ({ id }: { id: number }, { rejectWithValue }) => {
		try {
			const response = await api.get(id)
			return response.data.items[0]
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)

export const addLegalDocPowerTypes = createAsyncThunk(
	'legalDocPowerTypes/add',
	async (legalDoc: TLegalDocPowerType, { rejectWithValue }) => {
		try {
			const response = await api.add(legalDoc)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)

export const editLegalDocPowerTypes = createAsyncThunk(
	'legalDocPowerTypes/edit',
	async (legalDoc: TLegalDocPowerType, { rejectWithValue }) => {
		try {
			const response = await api.edit(legalDoc)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)

export const excludeLegalDocPowerTypes = createAsyncThunk(
	'legalDocPowerTypes/exclude',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await api.delete(id)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)
