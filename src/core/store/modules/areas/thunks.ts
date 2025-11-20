import { createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/core/api/areas';
import { TArea, TGroupedArea } from 'src/core/models/areas';

export const fetchAreas = createAsyncThunk(
	'areas/fetch',
	async (parentAreaId: any, { rejectWithValue }) => {
		try {
			const response = await api.getAreas({parentAreaId});
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchAreasWitchGroups = createAsyncThunk(
	'areas/fetchGroups',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.getParentAreas();
			const areas: TArea[] = response.data;
			return areas
		} catch (err: any) {
			return rejectWithValue(err.response.value)
		}
	}
);

export const fetchGroupedAreas = createAsyncThunk(
	'areas/fetchGroupedAreas',
	async (checkProfile: boolean, { rejectWithValue }) => {
		try {
			const response = await api.getParentAreasGrouped(checkProfile);
			const areas: TGroupedArea[] =  response.data;
			return areas 
		} catch (err: any) {
			return rejectWithValue(err.response.value)
		}
	}
);

export const fetchAreasByUserId = createAsyncThunk(
	'areas/fetchAreasByUserId',
	async (userId: number, { rejectWithValue }) => {
		try {
			const response = await api.getAreasByUserId(userId);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchGroupedAreasByUserId = createAsyncThunk(
	'areas/fetchGroupedAreasByUserId',
	async (parentAreaId: number[], { rejectWithValue }) => {
		try {
			const response = await api.getParentAreasGroupedById(parentAreaId);
			const areas: TGroupedArea[] =  response.data;
			return areas 
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);