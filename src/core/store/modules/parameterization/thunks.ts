import { createAsyncThunk } from '@reduxjs/toolkit';
import { TParameterization, renameProps } from 'src/core/models/parameterization';
import api from 'src/core/api/parameterization';
import { renameKeys } from 'src/core/utils/func';

export const fetchParameterization = createAsyncThunk(
	'parameterization/fetch',
	async (value: string[], { rejectWithValue }) => {
		try {
			const response = await api.getParam(value);
			return response.map((response: any) => renameKeys(renameProps)(response.data));
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editParameterization = createAsyncThunk(
	'parameterization/edit',
	async (params: TParameterization, { rejectWithValue }) => {
		const mappedParams = renameKeys(renameProps, true)(params);
		try {
			const response = await api.putParam(mappedParams);
			return response.data;
		} catch (err: any) {
			const pattern = /^System.NullReferenceException/i;
			if (pattern.test(err.response.data)) {
				try {
					const response = await api.postParam(mappedParams);
					return response.data;
				} catch (err: any) {
					return rejectWithValue(err.response.data);
				}
			}
			return rejectWithValue(err.response.data);
		}
	}
);
