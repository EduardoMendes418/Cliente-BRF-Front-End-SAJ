import { createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/core/api/circularizationOfficeLaunch'
import { actions } from '../..';

export const fetchCircularizationOfficeLaunch = createAsyncThunk(
	'circularizationOfficeLaunch/fetch',
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

export const addCircularizationOfficeLaunch = createAsyncThunk(
	'addCircularizationOfficeLaunch/add',
	async (values: any, { rejectWithValue }) => {
		try {
			const response = await api.add(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const fetchCircularizationOfficeLaunchById = createAsyncThunk(
	'circularizationOfficeLaunch/fetchById',
	async (id: number, { rejectWithValue }) => {

		try {
			const response = await api.getById(id);
			return response;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editCircularizationOfficeLaunch = createAsyncThunk(
	'circularizationOfficeLaunch/edit',
	async (values: any, { rejectWithValue }) => {
		try {
			const response = await api.edit(values);
			return response;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const uploadFilesOfficeLaunch = createAsyncThunk(
	'circularizationOfficeLaunch/uploadFiles',
	async ({ circularizationOfficeLaunchId, filesList, isMainFile }: any, { rejectWithValue }) => {
		try {
			const response = await api.uploadFiles(circularizationOfficeLaunchId, filesList, isMainFile)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err?.response?.data)
		}
	}
);

export const deleteFilesOfficeLaunch = createAsyncThunk(
	'circularizationOfficeLaunch/deleteFilesOfficeLaunch',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await api.deleteFile(id);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);