import { createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/core/api/litigation-natures';
import { ParamsGet } from 'src/core/models';

export const fetchLitigationNatures = createAsyncThunk(
	'litigationNatures/list',
	async (params: ParamsGet, { rejectWithValue }) => {
		try {
			const response = await api.list(params)
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
