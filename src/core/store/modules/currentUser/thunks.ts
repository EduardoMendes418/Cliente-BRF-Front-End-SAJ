import { createAsyncThunk } from '@reduxjs/toolkit';

import api from 'src/core/api/currentUser';

export const fetchUser = createAsyncThunk(
	'currentUser/fetch',
	async (_: string, { rejectWithValue }) => {
		try {
			const { data } = await api.get();
			return data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
