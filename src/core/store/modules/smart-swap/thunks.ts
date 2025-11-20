import { createAsyncThunk } from '@reduxjs/toolkit';

import api from 'src/core/api/smart-swap';
import { ParamsGet } from 'src/core/models';
import { TSmartSwapChangingParams, TSmartSwapFilter } from 'src/core/models/smart-swap';
import { actions } from 'src/core/store';
import { convertArrayBufferToObject } from 'src/core/utils/func';

export const fetchSmartSwap = createAsyncThunk(
	'smartSwap/fetch',
	async (values: ParamsGet & TSmartSwapFilter, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list(values);
			dispatch(actions.pagination.setPageCount(response.data.SmartSwapData.pageCount));
			dispatch(actions.pagination.setItemCount(response.data.SmartSwapData.itemCount));

			return {
				smartSwapId: response.data.SmartSwapId,
				items: response.data.SmartSwapData.items
			};
		} catch (err: any) {
			return rejectWithValue(err?.response?.data?.detail);
		}
	}
);

type TUpdateParams = {
	smartSwapId: string,
	params: TSmartSwapChangingParams,
	handleNotify: (notificationType: 'success' | 'error') => void
}

export const updateSmartSwap = createAsyncThunk(
	'smartSwap/update',
	async ({ smartSwapId, params, handleNotify }: TUpdateParams, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.update(smartSwapId, params);
			dispatch(actions.smartSwap.clear())
			handleNotify('success');
			return response.data

		} catch (err: any) {
			handleNotify('error')

			const data = err?.response?.data?.detail
			const regex = /^\{"logs":\[/ // an object with error logs
			if (typeof data === 'string' && regex.test(data)) {
				return rejectWithValue(JSON.parse(data))
			}

			return rejectWithValue(data);
		}
	}
)
type TReprocessParams = {
	processIds: number[], 
	data: string,
	smartSwapId: string,
	handleNotify: (notificationType: 'success' | 'error') => void
}
export const reprocessSmartSwap = createAsyncThunk(
	'smartSwap/reprocess',
	async ({ processIds, data, smartSwapId, handleNotify }: TReprocessParams, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.reprocess(processIds, data, smartSwapId);
			dispatch(actions.smartSwap.clear())
			handleNotify('success');
			return response.data

		} catch (err: any) {
			handleNotify('error')

			const data = err?.response?.data?.detail
			const regex = /^\{"logs":\[/ // an object with error logs
			if (typeof data === 'string' && regex.test(data)) {
				return rejectWithValue(JSON.parse(data))
			}

			return rejectWithValue(data);
		}
	}
)

type TExportParams = {
	smartSwapId: string,
	handleNotify: (notificationType: 'success' | 'error') => void
}

export const exportSmartSwap = createAsyncThunk(
	'smartSwap/export-excel',
	async ({ smartSwapId, handleNotify }: TExportParams, { rejectWithValue }) => {
		try {
			const response = await api.generateExcel(smartSwapId);
			const type = response.headers['content-type']
			return new Blob([response.data], { type });
		} catch (err: any) {
			handleNotify('error')
			const error = convertArrayBufferToObject(err.response.data)
			return rejectWithValue(error);
		}
	}
)
