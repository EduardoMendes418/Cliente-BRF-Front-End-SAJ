import { createAsyncThunk } from '@reduxjs/toolkit'

import api from 'src/core/api/process'
import apiProvision from 'src/core/api/provision'
import { TProvisionProcess } from 'src/core/models/provision-order'

export const fetchProvisionsProcess = createAsyncThunk(
	'provisionOrder/fetchProvisionsProcess',
	async (folderNumber: string, { rejectWithValue }) => {
		try {
			const response = await api.getProvisionsProcessByFolderNumber(folderNumber)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err?.response?.data)
		}
	}
)

export const fetchProvisionsProcessByProcessNumber = createAsyncThunk(
	'provisionOrder/fetchProvisionsProcessByProcessNumber',
	async (processNumber: string, { rejectWithValue }) => {
		if (!processNumber) {
			return
		}

		try {
			const response = await api.getProcessByIdentifierNumber(processNumber)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err?.response?.data)
		}
	}
);

export const updateProvisionsProcess = createAsyncThunk(
	'provisionOrder/updateProvisionsProcess',
	async (process: TProvisionProcess, { rejectWithValue }) => {
		try {
			const response = await api.updateProvisionsProcess(process)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err?.response?.data)
		}
	}
)

type TUploadProvisionProcess = {
	folderNumber: string
	files: FileList
}

export const uploadProvisionsProcessAttachments = createAsyncThunk(
	'provisionOrder/uploadProvisionsProcessAttachments',
	async ({ folderNumber, files }: TUploadProvisionProcess, { rejectWithValue }) => {
		try {
			const response = await api.uploadFiles(folderNumber, files)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err?.response?.data)
		}
	}
)

export const deleteProvisionsProcessAttachments = createAsyncThunk(
	'provisionOrder/deleteProvisionsProcessAttachments',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await api.deleteFile(id)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err?.response?.data)
		}
	}
)

export const checkHasJudicialDepositPending = createAsyncThunk(
	'provisionOrder/checkHasJudicialDepositPending',
	async (folderNumber: string, { rejectWithValue }) => {
		try {
			const response = await api.getProvisionsProcessJudicialDepositStatus(folderNumber)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err?.response?.data)
		}
	}
)

export const checkHasPaymentPending = createAsyncThunk(
	'provisionOrder/checkHasPaymentPending',
	async (folderNumber: string, { rejectWithValue }) => {
		try {
			const response = await api.getProvisionsProcessPaymentPendingStatus(folderNumber)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err?.response?.data)
		}
	}
)

export const checkProcessHasBlockAndTransferPending = createAsyncThunk(
	'provisionOrder/checkProcessHasBlockAndTransfer',
	async (folderNumber: string, { rejectWithValue }) => {
		try {
			const response = await api.getProcessHasBlockAndTransferPending(folderNumber)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err?.response?.data)
		}
	}
)

export const fetchProvisionsProcessByCsv = createAsyncThunk(
	'provisionOrder/fetchProvisionsProcess',
	async (formFile: FileList, { rejectWithValue }) => {
		try {
			const response = await apiProvision.getProvisionsProcessByCsv(formFile)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err?.response?.data)
		}
	}
)
