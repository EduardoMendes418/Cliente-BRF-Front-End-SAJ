import { createAsyncThunk } from '@reduxjs/toolkit';

import api from '../../../api/log-provision';
import { TLogProvisionBasicParameters, TLogProvisionParameters } from '../../../models/log-provision';
import { actions } from '../..';

export const fetchLogProvisioList = createAsyncThunk(
	'logProvison/LogProvisioList',
	async (params: TLogProvisionParameters, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list(params);
			dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchLogProvisionSumOfValues = createAsyncThunk(
	'logProvison/sumOfValue',
	async (params: TLogProvisionBasicParameters, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.listSumOfValues(params);
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchLogProvisionTotalizerGrid = createAsyncThunk(
	'logProvison/totalizerGrid',
	async (params: TLogProvisionBasicParameters, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.listSumOfValues(params);
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);