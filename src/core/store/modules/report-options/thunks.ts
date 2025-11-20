import { createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/core/api/report-options';

export const fetchBusinessAreas = createAsyncThunk(
	'reportOptions/fetchBusinessAreas',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.getBusinessAreas()
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
		
	}
);

export const fetchProvisionClasses = createAsyncThunk(
	'reportOptions/fetchProvisionClasses',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.getProvisionClasses()
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
		
	}
);

export const fetchGrouperCostCenters = createAsyncThunk(
	'reportOptions/fetchGrouperCostCenters',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.getGrouperCostCenters();
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
		
	}
);


