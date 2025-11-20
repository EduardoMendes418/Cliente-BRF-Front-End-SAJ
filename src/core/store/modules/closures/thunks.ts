import { createAsyncThunk } from '@reduxjs/toolkit';
import { ParamsGet } from "src/core/models"

import api from '../../../api/closures';
import { TClosures, renameProps } from '../../../models/closures';
import { renameKeys } from 'src/core/utils/func';
import { actions } from 'src/core/store';

export const fetchClosuresResultList = createAsyncThunk(
	'closuresResult/fetch',
	async (params: ParamsGet & {status?: number}, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list(params);
			!params.notPaginate && dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return renameKeys(renameProps)(response.data)
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const addClosure = createAsyncThunk(
	'closuresResult/add',
	async (values: TClosures, { rejectWithValue }) => {
		try {
			const response = await api.add(renameKeys(renameProps, true)(values));
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editClosure = createAsyncThunk(
	'closuresResult/edit',
	async (values: TClosures, { rejectWithValue }) => {
		try {
			const response = await api.edit(renameKeys(renameProps, true)(values));
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);