import { createAsyncThunk } from '@reduxjs/toolkit'

import api from 'src/core/api/legal-document-draft-types'
import { TLegalDocDraftType, TLegalDocDraftTypeFilter } from 'src/core/models/legal-document-draft-types'
import { rejectNoValues } from 'src/core/utils/func'

import { actions } from '../..'

export const fetchLegalDocDraftTypes = createAsyncThunk(
	'legalDocDraftTypes/fetch',
	async ({ notPaginate, ...filter }: TLegalDocDraftTypeFilter, { rejectWithValue, dispatch }) => {
		const params = rejectNoValues(filter) as TLegalDocDraftTypeFilter
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

export const getLegalDocDraftTypes = createAsyncThunk(
	'legalDocDraftTypes/get',
	async ({ id }: { id: number }, { rejectWithValue }) => {
		try {
			const response = await api.get(id)
			return response.data.items[0]
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)

export const addLegalDocDraftTypes = createAsyncThunk(
	'legalDocDraftTypes/add',
	async (legalDoc: TLegalDocDraftType, { rejectWithValue }) => {
		try {
			const response = await api.add(legalDoc)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)

export const editLegalDocDraftTypes = createAsyncThunk(
	'legalDocDraftTypes/edit',
	async (legalDoc: TLegalDocDraftType, { rejectWithValue }) => {
		try {
			const response = await api.edit(legalDoc)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)

export const excludeLegalDocDraftTypes = createAsyncThunk(
	'legalDocDraftTypes/exclude',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await api.delete(id)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)

type DraftTypeUploadParams = {
	draftTypeId: number, files: FileList
}

export const uploadFileLegalDocDraftTypes = createAsyncThunk(
	'legalDocDraftTypes/uploadFileLegalDocDraftTypes',
	async ({ draftTypeId, files }: DraftTypeUploadParams, { rejectWithValue }) => {
		try {
			const response = await api.uploadFiles(draftTypeId, files)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err?.response?.data)
		}
	}
)

export const deleteFileLegalDocDraftTypes = createAsyncThunk(
	'legalDocDraftTypes/deleteFileLegalDocDraftTypes',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await api.deleteFile(id);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);