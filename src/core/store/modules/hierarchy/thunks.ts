import { createAsyncThunk } from '@reduxjs/toolkit';
import { THierarchy, renameProps, renameSearchProps, THierarchyFilter } from 'src/core/models/hierarchy';
import api, { Params } from 'src/core/api/hierarchy';
import { renameKeys } from 'src/core/utils/func';
import { actions } from '../..';

export const fetchHierarchy = createAsyncThunk(
	'hierarchy/fetch',
	async ({notPaginate, ...values }: Params | THierarchyFilter, { dispatch }) => {
		try {
			const filterParams = renameKeys(renameSearchProps, true)(values);

			if (!filterParams.areaJuridica) delete filterParams.areaJuridica;
			const response = await api.getHierarchy(filterParams);

			let mappedResponseItems = response.data.items;
			if (mappedResponseItems && mappedResponseItems.length) {
				mappedResponseItems = mappedResponseItems
					.map((item: any) => renameKeys(renameProps)(item) as THierarchy)
			}

		   if(!notPaginate)
			 dispatch(actions.pagination.setPageCount(response.data.pageCount))

			return { ...response.data, items: mappedResponseItems };
		} catch (err: any) {
			console.error({ error: err.response.data });
		}
	},
);

export const addHierarchy = createAsyncThunk(
	'hierarchy/add',
	async (value: THierarchy, { rejectWithValue }) => {
		try {
			const data = renameKeys(renameProps, true)(value);
			const response = await api.postHierarchy(data);
			return response.data;
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	},
);

export const editHierarchy = createAsyncThunk(
	'hierarchy/edit',
	async (value: THierarchy, { rejectWithValue }) => {
		try {
			const data = renameKeys(renameProps, true)(value);
			const response = await api.editHierarchy(data);
			return response.data;
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	},
);

export const deleteHierarchy = createAsyncThunk(
	'hierarchy/delete',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await api.deleteHierarchy(id.toString());
			return response.data;
		} catch (err: any) {
			return rejectWithValue({ id, error: err.response.data });
		}
	},
);

export const getHierarchyById = createAsyncThunk(
	'hierarchy/fetch',
	async (id: string, { rejectWithValue }) => {
		try {
			const response = await api.getHierarchyById(id.toString());
			return response.data;
		} catch (err: any) {
			return rejectWithValue({ id, error: err.response.data });
		}
	},
);

export const fetchHierarchyList = createAsyncThunk(
	'hierarchy/fetchHierarchyList',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.getHierarchyList();
			return response.data;
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	},
);