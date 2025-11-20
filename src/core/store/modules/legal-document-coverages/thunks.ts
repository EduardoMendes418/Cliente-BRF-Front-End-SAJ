import { createAsyncThunk } from '@reduxjs/toolkit'

import api from 'src/core/api/legal-document-coverages'
import { TLegalDoc, TLegalDocFilter } from 'src/core/models/legal-document-coverages'
import { rejectNoValues } from 'src/core/utils/func'

import { actions } from '../..'

export const fetchLegalDocCoverage = createAsyncThunk(
	'legalDocsCoverage/fetch',
	async ({ notPaginate, ...filter }: TLegalDocFilter, { rejectWithValue, dispatch }) => {
		const params = rejectNoValues(filter) as TLegalDocFilter
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

export const getLegalDocCoverage = createAsyncThunk(
	'legalDocsCoverage/get',
	async ({ id }: { id: number }, { rejectWithValue }) => {
		try {
			const response = await api.get(id)
			return response.data.items[0]
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)

export const addLegalDocCoverage = createAsyncThunk(
	'legalDocsCoverage/add',
	async (legalDoc: TLegalDoc, { rejectWithValue }) => {
		try {
			const response = await api.add(legalDoc)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)

export const editLegalDocCoverage = createAsyncThunk(
	'legalDocsCoverage/edit',
	async (legalDoc: TLegalDoc, { rejectWithValue }) => {
		try {
			const response = await api.edit(legalDoc)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)

export const excludeLegalDocCoverage = createAsyncThunk(
	'legalDocsCoverage/exclude',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await api.delete(id)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)
