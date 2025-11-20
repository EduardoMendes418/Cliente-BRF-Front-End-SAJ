import { createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/core/api/litigation-phases';
import { ParamsGet } from 'src/core/models';

export const fetchLitigationPhases = createAsyncThunk(
	'litigationPhases/list',
	async (params: ParamsGet, { rejectWithValue }) => {
		try {
			const response = await api.list(params)
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
