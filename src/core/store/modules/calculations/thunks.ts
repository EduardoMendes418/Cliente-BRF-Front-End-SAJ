import { createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder, TStatisticalOrder } from 'src/core/models/process';
import api from 'src/core/api/process';

export const updateObjectsInformation = createAsyncThunk(
	'calculations/updateObjectsInformation',
	async ({ newObjects, existingObjects }: { newObjects: TOrder[], existingObjects: TOrder[] }, { rejectWithValue }) => {
		try {
			if (existingObjects.length > 0) await api.updateObjectsInformation(existingObjects);
			if (newObjects.length > 0) await api.saveObjectsInformation(newObjects);
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const updateCalculationsFolder = createAsyncThunk(
	'calculations/updateFolder',
	async (value: TStatisticalOrder) => {
		const response = await api.updateFolder(value);
		return response.map(({ data }: any) => data);
	}
);

export const deleteCalculationsFile = createAsyncThunk(
	'calculations/deleteFile',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await api.deleteFile(id);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
