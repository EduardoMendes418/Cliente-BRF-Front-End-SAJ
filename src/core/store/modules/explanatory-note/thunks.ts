import { createAsyncThunk } from '@reduxjs/toolkit';

import api from 'src/core/api/explanatory-note';
import { TExplanatoryNote, TExplanatoryNoteFilter } from 'src/core/models/explanatory-note';

import { actions, RootState } from '../..';
import { rejectNoValues } from 'src/core/utils/func';

export const fetchExplanatoryNote = createAsyncThunk(
	'explanatoryNote/fetch',
	async ({ id, page, pageSize, notPaginate, description }: TExplanatoryNoteFilter, { rejectWithValue, dispatch }) => {
		try {
			const normalizedValues = rejectNoValues({
				id,
				page,
				pageSize,
				description
			}) as TExplanatoryNoteFilter;
			const response = await api.list(normalizedValues);
			!notPaginate && dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return response.data
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
)

export const getExplanatoryNote = createAsyncThunk(
	'explanatoryNote/get',
	async (id: number, { getState }) => {
		const { explanatoryNote: { list } } = getState() as RootState

		const item = list.find((item) => item.id === id)
		if (item) return item

		const response = await api.get(id);
		return response.data
	}
);

export const addExplanatoryNote = createAsyncThunk(
	'explanatoryNote/add',
	async (values: TExplanatoryNote, { rejectWithValue }) => {
		try {
			const response = await api.add(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const editExplanatoryNote = createAsyncThunk(
	'explanatoryNote/edit',
	async (values: TExplanatoryNote, { rejectWithValue }) => {
		try {
			const response = await api.edit(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);