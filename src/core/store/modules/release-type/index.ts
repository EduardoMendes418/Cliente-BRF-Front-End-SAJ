import { createSlice } from '@reduxjs/toolkit';
import {
	fetchReleaseType,
	getReleaseType,
	addReleaseType,
	editReleaseType,
} from './thunks';
import { TReleaseTypeFilter, TReleaseType } from 'src/core/models/release-type';
import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..';

export type TError = {
	id?: number;
	error: { detail: string };
};

export type TReleaseTypeState = {
	list: TReleaseType[];
	item?: TReleaseType;
	listFilters: TReleaseTypeFilter;
};

const initialState: TState & TReleaseTypeState = {
	status: 'initial',
	list: [],
	item: {} as TReleaseType,
	error: {} as TError,
	listFilters: {} as TReleaseTypeFilter,
};

const slice = createSlice({
	name: 'releaseType',
	initialState,
	reducers: {
		...clears(initialState),
		setItem: (state, action) => {
			state.item = action.payload;
		},
		setFilters: (state, { payload }) => {
			state.listFilters = payload
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchReleaseType)
		caseDefault(addCase, getReleaseType, 'item')
		caseDefaultRegister(addCase, addReleaseType, 'added')
		caseDefaultRegister(addCase, editReleaseType, 'edited')
	},
});

export default slice;