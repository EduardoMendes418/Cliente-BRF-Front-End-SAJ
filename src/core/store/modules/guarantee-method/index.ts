import { createSlice } from '@reduxjs/toolkit';
import {
	fetchGuaranteeMethod,
	getGuaranteeMethod,
	addGuaranteeMethod,
	editGuaranteeMethod,
} from './thunks';
import { TGuaranteeMethod } from 'src/core/models/guarantee-method';
import { ParamsGet, TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..';

export type TError = {
	id?: number;
	error: { detail: string };
};

export type State = {
	list: TGuaranteeMethod[];
	item: TGuaranteeMethod;
	listFilters: ParamsGet;
};

const initialState: TState & State = {
	status: 'initial',
	list: [] as TGuaranteeMethod[],
	item: {} as TGuaranteeMethod,
	error: {} as TError,
	listFilters: {} as ParamsGet,
};

const slice = createSlice({
	name: 'guaranteeMethod',
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
		caseDefault(addCase, fetchGuaranteeMethod)
		caseDefault(addCase, getGuaranteeMethod, 'item')
		caseDefaultRegister(addCase, addGuaranteeMethod, 'added')
		caseDefaultRegister(addCase, editGuaranteeMethod, 'edited')
	},
});

export default slice;
