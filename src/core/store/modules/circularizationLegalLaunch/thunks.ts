import { createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/core/api/circularizationLegalLaunch'
import { actions } from '../..';

export const fetchCircularizationLegalLaunch = createAsyncThunk(
	'circularizationLegalLaunch/fetch',
	async ({ notPaginate, ...values }: any, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list(values);
			!notPaginate && dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return {
				...response.data,
				items: response.data.items.map((items: []) => items)
			}
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const fetchCircularizationLegalLaunchById = createAsyncThunk(
	'circularizationOLegalLaunch/fetchById',
	async (id: number, { rejectWithValue }) => {

		try {
			const response = await api.getById(id);
			return response;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editCircularizationLegalLaunch = createAsyncThunk(
	'circularizationLegalLaunch/edit',
	async (values: any, { rejectWithValue }) => {
		try {
			const response = await api.edit(values);
			return response;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const uploadFilesLegalLaunch = createAsyncThunk(
	'circularizationLegalLaunch/uploadFiles',
	async ({ circularizationLegalLaunchId, filesList, isMainFile }: any, { rejectWithValue }) => {
		try {
			const response = await api.uploadFiles(circularizationLegalLaunchId, filesList, isMainFile)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err?.response?.data)
		}
	}
);

export const deleteFilesLegalLaunch = createAsyncThunk(
	'circularizationLegalLaunch/deleteFilesOfficeLaunch',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await api.deleteFile(id);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);