import { createSlice } from '@reduxjs/toolkit';
import {
	fetchPaymentType,
	editPaymentType,
	deletePaymentType,
	addPaymentType,
} from './thunks';
import { TPaymentType, TPaymentTypeFilters } from 'src/core/models/payment-type';
import { TState } from 'src/core/models';
import { caseDefault, caseDefaultRegister, clears } from '..';

export type State = {
	list: TPaymentType[];
	item: TPaymentType;
	listFilters: { [page: string]: TPaymentTypeFilters };
};

const initialState: TState & State = {
	status: 'initial',
	list: [] as TPaymentType[],
	item: {} as TPaymentType,
	error: '',
	listFilters: {} as { [page: string]: TPaymentTypeFilters },
};

const slice = createSlice({
	name: 'paymentType',
	initialState,
	reducers: {
		...clears(initialState),

		setItem: (state, { payload }) => {
			state.item = payload;
		},

		setFilters(state, { payload }) {
			state.listFilters[payload.page] = payload.filters;
		}
	},
	extraReducers: ({ addCase }) => {

		caseDefaultRegister(addCase, addPaymentType, 'added')
		caseDefaultRegister(addCase, editPaymentType, 'edited')
		caseDefaultRegister(addCase, deletePaymentType, 'deleted')

		caseDefault(addCase, fetchPaymentType, (state, action) => {
			state.status = 'initial';
			action.payload.items
				? state.list = action.payload.items
				: state.item = action.payload;
		})

	},
});

export default slice;
