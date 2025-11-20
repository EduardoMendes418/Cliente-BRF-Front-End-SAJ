import { createAsyncThunk } from '@reduxjs/toolkit';
import { TFormOfCorrection } from 'src/core/models/pensions';
import api from 'src/core/api/form-of-correction';

export const fetchFormOfCorrection = createAsyncThunk(
	'formOfCorrection/fetch',
	async () => {
		try {
			const response = await api.list();
			return response.data;
		} catch (err: any) {
			console.error({ error: err.response.data });
		}
	}
);

export const addFormOfCorrection = createAsyncThunk(
	'formOfCorrection/add',
	async (value: TFormOfCorrection, { rejectWithValue }) => {
		try {
			const response = await api.add(value);
			return response.data;
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const editFormOfCorrection = createAsyncThunk(
	'formOfCorrection/edit',
	async (values: TFormOfCorrection, { rejectWithValue }) => {
		try {
			const response = await api.edit(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const deleteFormOfCorrection = createAsyncThunk(
	'formOfCorrection/delete',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await api.delete(id.toString());
			return response.data;
		} catch (err: any) {
			return rejectWithValue({ id, error: err.response.data });
		}
	}
);
