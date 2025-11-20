import { createAsyncThunk } from '@reduxjs/toolkit';
import pensionRequestAPI, { TSeekRequest } from 'src/core/api/pension-request';
import { TUpdateStatus } from 'src/core/models';
import { renameProps, TRequestPension } from 'src/core/models/pensions';
import { actions } from 'src/core/store';
import { renameKeys } from 'src/core/utils/func';

export const fetchPensionRequest = createAsyncThunk(
	'pensionRequest/fetchRequest',
	async (params: TSeekRequest, { dispatch, rejectWithValue }) => {
		try {
			const response = await pensionRequestAPI.listRequest(params);
			dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return renameKeys(renameProps)(response.data)
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchPensionCategories = createAsyncThunk(
	'pensionRequest/fetchCategories',
	async () => {
		const response = await pensionRequestAPI.getCategories();
		return response.data;
	}
);

export const fetchPensionClosureReason = createAsyncThunk(
	'pensionRequest/fetchClosureReason',
	async () => {
		const response = await pensionRequestAPI.getClosureReason();
		return response.data;
	}
);

export const addPensionRequest = createAsyncThunk(
	'pensionRequest/addRequest',
	async ({ attachments, ...values }: TRequestPension, { rejectWithValue }) => {
		try {
			const response = await pensionRequestAPI.addRequest(values);
			const pensionId = response.data.id;
			if (pensionId && attachments && attachments.length > 0) {
				try {
					const responseFile = await pensionRequestAPI.uploadFiles(pensionId, attachments as any);
					return responseFile.data;
				} catch (err: any) {
					return rejectWithValue(err.response.data);
				}
			}
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);


export const deletePensionRequestFile = createAsyncThunk(
	'pensionRequest/deleteFile',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await pensionRequestAPI.deleteFile(id);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const setStatusPensionRequest = createAsyncThunk(
	'pensionRequest/setStatus',
	async (data: TUpdateStatus, { rejectWithValue }) => {
		try {
			const response = await pensionRequestAPI.setStatus(data);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
)

export const editPensionRequest = createAsyncThunk(
	'pensionRequest/editRequest',
	async ({ attachments, ...values }: any, { rejectWithValue }) => {
		try {
			delete values.logs;
			delete values.pensionRequestPayments;

			const response = await pensionRequestAPI.editRequest(values);
			const pensionId = response.data.id;
			if (pensionId && attachments && attachments.length > 0) {
				try {
					const responseFile = await pensionRequestAPI.uploadFiles(pensionId, attachments as any);
					return responseFile.data;
				} catch (err: any) {
					return rejectWithValue(err.response.data);
				}
			}
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
)