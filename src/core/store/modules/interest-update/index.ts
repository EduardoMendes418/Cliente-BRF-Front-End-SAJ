import { createSlice } from '@reduxjs/toolkit';
import {
	fetchInterestUpdate,
	fetchItemInterestUpdate,
	addInterestUpdate,
	editInterestUpdate,
	deleteInterestUpdate,
} from './thunks';
import { TInterestUpdate, TInterestUpdateFilter } from 'src/core/models/interest-update';
import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..';

export type TError = {
	id?: number;
	error: { detail: string };
};

export type TInterestUpdateState = {
	list: TInterestUpdate[];
	item?: TInterestUpdate;
	listFilters: TInterestUpdateFilter;
};

const initialState: TState & TInterestUpdateState = {
	status: 'initial',
	list: [],
	item: undefined,
	error: {} as TError,
	listFilters: {} as TInterestUpdateFilter,
};

const slice = createSlice({
	name: 'interestUpdate',
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
		caseDefault(addCase, fetchInterestUpdate)
		caseDefault(addCase, fetchItemInterestUpdate, 'item')
		caseDefaultRegister(addCase, addInterestUpdate, 'added')
		caseDefaultRegister(addCase, editInterestUpdate, 'edited')
		caseDefaultRegister(addCase, deleteInterestUpdate, 'deleted')
	},
});

export default slice;
