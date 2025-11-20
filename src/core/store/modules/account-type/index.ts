import { createSlice } from '@reduxjs/toolkit';
import {
	fetchAccountType,
	getAccountType,
	addAccountType,
	editAccountType,
} from './thunks';
import { TAccountTypeFilter, TAccountType } from 'src/core/models/account-type';
import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..';

export type TError = {
	id?: number;
	error: { detail: string };
};

export type TAccountTypeState = {
	list: TAccountType[];
	item?: TAccountType;
	listFilters: TAccountTypeFilter;
};

const initialState: TState & TAccountTypeState = {
	status: 'initial',
	list: [],
	item: {} as TAccountType,
	error: {} as TError,
	listFilters: {} as TAccountTypeFilter,
};

const slice = createSlice({
	name: 'accountType',
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
		caseDefault(addCase, fetchAccountType)
		caseDefault(addCase, getAccountType, 'item')
		caseDefaultRegister(addCase, addAccountType, 'added')
		caseDefaultRegister(addCase, editAccountType, 'edited')
	},
});

export default slice;