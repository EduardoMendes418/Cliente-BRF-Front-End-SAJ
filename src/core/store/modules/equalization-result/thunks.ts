import { createAsyncThunk } from '@reduxjs/toolkit';

import api from '../../../api/equalization-result';
import { TEqualizationResultParams } from '../../../models/equalization-result';

export const fetchEqualizationResultList = createAsyncThunk(
	'equalizationResult/fetch',
	async (values: TEqualizationResultParams, { rejectWithValue }) => {
		try {
			const response = await api.list(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
