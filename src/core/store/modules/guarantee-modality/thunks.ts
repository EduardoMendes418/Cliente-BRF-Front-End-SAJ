import { createAsyncThunk } from '@reduxjs/toolkit';
import { pathOr } from 'ramda'

import { renameProps, TGuaranteeModality } from 'src/core/models/guarantee-modality';
import api from 'src/core/api/guarantee-modality';
import { actions, RootState } from '../..';
import { renameKeys } from 'src/core/utils/func';
import { ParamsGet } from 'src/core/models';

export type TGuaranteeModalityParams = ParamsGet & {
	notPaginate?: boolean;
	description?: string;
	processType?: string;
	goodsGuaranteeMethodId?: number | '';
};

const normalizeData = (data: any, back?: boolean) => {
	const normalizedData = renameKeys(renameProps, back)(data)
	const prop = back ? 'goodsGuaranteesModalityMethods' : 'guaranteeMethodIds'

	if (Array.isArray(normalizedData[prop])) normalizedData[prop] = [
		...normalizedData[prop].map((item: any) => back
			? ({ goodsGuaranteesMethodId: item })
			: item.goodsGuaranteesMethodId)
	]

	return normalizedData
}

export const fetchGuaranteeModality = createAsyncThunk(
	'guaranteeModality/fetch',
	async ({ notPaginate, ...values }: TGuaranteeModalityParams, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list(values);
			!notPaginate && dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return {
				...response.data,
				items: response.data.items.map((items: []) => normalizeData(items))
			}
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const getGuaranteeModality = createAsyncThunk(
	'guaranteeModality/get',
	async (id: number, { getState }) => {
		const { guaranteeModality: { list } } = getState() as RootState

		const item = list.find((item) => item.id === id)
		if (item) return item

		const response = await api.list({ id });
		return normalizeData(pathOr({}, ['data', 'items', 0], response))
	}
);

export const addGuaranteeModality = createAsyncThunk(
	'guaranteeModality/add',
	async (values: TGuaranteeModality, { rejectWithValue }) => {
		try {
			const response = await api.add(normalizeData(values, true));
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editGuaranteeModality = createAsyncThunk(
	'guaranteeModality/edit',
	async (values: TGuaranteeModality, { rejectWithValue }) => {
		try {
			const response = await api.edit(normalizeData(values, true));
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
