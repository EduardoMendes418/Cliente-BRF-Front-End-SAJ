import { createAsyncThunk } from '@reduxjs/toolkit'

import api from 'src/core/api/legal-document-request-status'
import { TLegalDocReqStatus, TLegalDocReqStatusFilter } from 'src/core/models/legal-document-request-status'
import { rejectNoValues } from 'src/core/utils/func'

import { actions } from '../..'

export const fetchLegalDocReqStatus = createAsyncThunk(
	'legalDocReqStatus/fetch',
	async ({ notPaginate, ...filter }: TLegalDocReqStatusFilter, { rejectWithValue, dispatch }) => {
		const params = rejectNoValues(filter) as TLegalDocReqStatusFilter
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

export const getLegalDocReqStatus = createAsyncThunk(
	'legalDocReqStatus/get',
	async ({ id }: { id: number }, { rejectWithValue }) => {
		try {
			const response = await api.get(id)
			return response.data.items[0]
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)

export const addLegalDocReqStatus = createAsyncThunk(
	'legalDocReqStatus/add',
	async (legalDoc: TLegalDocReqStatus, { rejectWithValue }) => {
		try {
			const response = await api.add(legalDoc)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)

export const editLegalDocReqStatus = createAsyncThunk(
	'legalDocReqStatus/edit',
	async (legalDoc: TLegalDocReqStatus, { rejectWithValue }) => {
		try {
			const response = await api.edit(legalDoc)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)

export const excludeLegalDocReqStatus = createAsyncThunk(
	'legalDocReqStatus/exclude',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await api.delete(id)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)
