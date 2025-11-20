import { createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/core/api/state-city';

export const fetchStates = createAsyncThunk(
	'stateCity/fetchStates',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.getStates();
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchCitiesByState = createAsyncThunk(
	'stateCity/fetchCitiesByState',
	async (stateId: number, { rejectWithValue }) => {
		try {
			const response = await api.getCitiesByState(stateId);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
