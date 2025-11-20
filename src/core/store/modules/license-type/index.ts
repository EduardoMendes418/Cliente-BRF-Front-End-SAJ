import { createSlice } from '@reduxjs/toolkit';
import {
	fetchLicenseType,
	getLicenseType,
	addLicenseType,
	editLicenseType,
} from './thunks';
import { TLicenseType, TLicenseFilter } from 'src/core/models/license-type';
import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..';

export type TError = {
	id?: number;
	error: { detail: string };
};

export type TLicenseTypeState = {
	list: TLicenseType[];
	item?: TLicenseType;
	listFilters: TLicenseFilter;
};

const initialState: TState & TLicenseTypeState = {
	status: 'initial',
	list: [],
	item: undefined,
	error: {} as TError,
	listFilters: {} as TLicenseFilter,
};

const slice = createSlice({
	name: 'licenseType',
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
		caseDefault(addCase, fetchLicenseType)
		caseDefault(addCase, getLicenseType, 'item')
		caseDefaultRegister(addCase, addLicenseType, 'added')
		caseDefaultRegister(addCase, editLicenseType, 'edited')
	},
});

export default slice;
