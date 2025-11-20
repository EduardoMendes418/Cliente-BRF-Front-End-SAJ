import { createAsyncThunk } from '@reduxjs/toolkit';
import { pathOr } from 'ramda';

import api from 'src/core/api/civil-mass';
import { TCivilMass, TCivilMassParams } from 'src/core/models/civil-mass';
import { actions, RootState } from '../..';

export const fetchCivilMassList = createAsyncThunk(
	'civilMass/fetch',
	async (values: TCivilMassParams, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list(values);
			dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchCivilMassById = createAsyncThunk(
	'civilMass/fetchById',
	async (id: number, { getState, rejectWithValue }) => {
		try {
			const { civilMass: { list } } = getState() as RootState;

			const item = list.find((item) => item.id === id);
			if (item) return item;

			const response = await api.getById(id);
			return pathOr({}, ['data', 'items', 0], response);
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const addCivilMass = createAsyncThunk(
	'civilMass/add',
	async (values: TCivilMass, { rejectWithValue }) => {
		try {
			const response = await api.add(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editCivilMass = createAsyncThunk(
	'civilMass/edit',
	async (values: TCivilMass & { id: number }, { rejectWithValue }) => {
		try {
			const response = await api.edit(values)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
