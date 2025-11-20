import { createAsyncThunk } from '@reduxjs/toolkit';
import { pathOr } from 'ramda'

import api from 'src/core/api/smart-swap-execution';
import { actions, RootState } from '../..';
import { ParamsGet } from 'src/core/models';
import { rejectNoValues } from 'src/core/utils/func';
import { StatusExecutionSmartSwap, SmartSwapChangesParameters, SmartSwapChangesResponse } from 'src/core/models/smart-swap-execution';

export const fetchsmartSwapExecution = createAsyncThunk(
	'smartSwapExecution/fetch',
	async (values: SmartSwapChangesParameters, { rejectWithValue, dispatch }) => {
		try {
			const normalizedValues = rejectNoValues(values)
			const response = (await api.list(normalizedValues)).data as SmartSwapChangesResponse;

			dispatch(actions.pagination.setPageCount(response.pageCount))
				
			return response
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetstatusExecutionSmartSwap = createAsyncThunk(
	'smartSwapExecution/statusExecutionSmartSwap',
	async (_, { rejectWithValue }) => {
		try {
			const response = (await api.statusExecutionSmartSwap()).data as StatusExecutionSmartSwap[];

			return response
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetstatusstatusProcessSmartSwap = createAsyncThunk(
	'smartSwapExecution/statusstatusProcessSmartSwap',
	async (_, { rejectWithValue }) => {
		try {
			const response = (await api.statusProcessSmartSwap()).data as StatusExecutionSmartSwap[];

			return response
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);