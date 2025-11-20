import { createAsyncThunk } from '@reduxjs/toolkit'

import api from 'src/core/api/legal-document-request-types'
import { TLegalDocRequestType, TLegalDocRequestTypeFilter } from 'src/core/models/legal-document-request-types'
import { rejectNoValues } from 'src/core/utils/func'

import { actions } from '../..'

export const fetchLegalDocReqTypes = createAsyncThunk(
	'legalDocsReqTypes/fetch',
	async ({ notPaginate, ...filter }: TLegalDocRequestTypeFilter, { rejectWithValue, dispatch }) => {
		const params = rejectNoValues(filter) as TLegalDocRequestTypeFilter
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

export const getLegalDocReqTypes = createAsyncThunk(
	'legalDocsReqTypes/get',
	async ({ id }: { id: number }, { rejectWithValue }) => {
		try {
			const response = await api.get(id)
			return response.data.items[0]
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)

export const addLegalDocReqTypes = createAsyncThunk(
	'legalDocsReqTypes/add',
	async (legalDoc: TLegalDocRequestType, { rejectWithValue }) => {
		try {
			const response = await api.add(legalDoc)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)

export const editLegalDocReqTypes = createAsyncThunk(
	'legalDocsReqTypes/edit',
	async (legalDoc: TLegalDocRequestType, { rejectWithValue }) => {
		try {
			const response = await api.edit(legalDoc)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)

export const excludeLegalDocReqTypes = createAsyncThunk(
	'legalDocsReqTypes/exclude',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await api.delete(id)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)
