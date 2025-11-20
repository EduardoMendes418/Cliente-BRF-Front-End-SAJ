import { createSlice } from '@reduxjs/toolkit';
import {
	fetchGuaranteeType,
	getGuaranteeType,
	addGuaranteeType,
	editGuaranteeType,
} from './thunks';
import { TGuaranteeType, TGuaranteeFilter } from 'src/core/models/guarantee-type';
import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..';

export type TError = {
	id?: number;
	error: { detail: string };
};

export type TGuaranteeTypeState = {
	list: TGuaranteeType[];
	item?: TGuaranteeType;
	listFilters: TGuaranteeFilter;
};

const initialState: TState & TGuaranteeTypeState = {
	status: 'initial',
	list: [],
	item: undefined,
	error: {} as TError,
	listFilters: {} as TGuaranteeFilter,
};

const slice = createSlice({
	name: 'guaranteeType',
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
		caseDefault(addCase, fetchGuaranteeType)
		caseDefault(addCase, getGuaranteeType, 'item')
		caseDefaultRegister(addCase, addGuaranteeType, 'added')
		caseDefaultRegister(addCase, editGuaranteeType, 'edited')
	},
});

export default slice;
