import { createSlice } from '@reduxjs/toolkit';
import {
	fetchPaymentMethod,
	editPaymentMethod,
	deletePaymentMethod,
	addPaymentMethod,
} from './thunks';
import { TPaymentMethod } from 'src/core/models/payment-method';
import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..';

export type TError = {
	id?: number;
	error: { detail: string };
};

export type State = {
	list: TPaymentMethod[];
	selectedList: TPaymentMethod[];
	item: TPaymentMethod;
};

const initialState: TState & State = {
	status: 'initial',
	list: [] as TPaymentMethod[],
	selectedList: [] as TPaymentMethod[],
	item: {} as TPaymentMethod,
	error: {} as TError
};

const slice = createSlice({
	name: 'paymentMethod',
	initialState,
	reducers: {
		...clears(initialState),
		setItem: (state, { payload }) => {
			state.item = payload;
		},
		setSelectedList: (state, { payload }) => {
			state.selectedList = payload;
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchPaymentMethod)
		caseDefaultRegister(addCase, addPaymentMethod, 'added')
		caseDefaultRegister(addCase, editPaymentMethod, 'edited')
		caseDefaultRegister(addCase, deletePaymentMethod, 'deleted')
	},
});

export default slice;
