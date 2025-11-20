import { createSlice } from '@reduxjs/toolkit';
import {

	fetchPaymentAccountType,
	addPaymentAccountType,
	editPaymentAccountType,
} from './thunks';
import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..';

export type TError = {
	detail: string;
};

export type State = {
	list: any[];
	item: any;
	error: TError;
	listFilters: any
};

const initialState: TState & State = {
	status: 'initial',
	list: [] as any[],
	item: {} as any,
	error: {} as TError,
	listFilters: {} as any,
};

const slice = createSlice({
	name: 'paymentAccountType',
	initialState,
	reducers: {
		...clears(initialState),
		setItem: (state, { payload }) => {
			state.item = payload;
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchPaymentAccountType)
		caseDefaultRegister(addCase, addPaymentAccountType, 'added')
		caseDefaultRegister(addCase, editPaymentAccountType, 'edited')
	},
});

export default slice;
