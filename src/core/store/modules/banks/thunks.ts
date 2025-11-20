import { createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/core/api/banks';

export const fetchBanks = createAsyncThunk(
	'banks/fetch',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.getBanks();
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
