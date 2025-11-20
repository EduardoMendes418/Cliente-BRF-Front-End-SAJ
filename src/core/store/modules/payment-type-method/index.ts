import { createSlice } from '@reduxjs/toolkit';
import {
	fetchPaymentTypeMethod,
	editPaymentTypeMethod,
	addPaymentTypeMethod,
} from './thunks';
import { TPaymentTypeMethod } from 'src/core/models/payment-type-method';
import { TState } from 'src/core/models';
import { caseDefault, caseDefaultRegister, clears } from '..';

export type State = {
	list: TPaymentTypeMethod[];
	item: TPaymentTypeMethod;
};

const initialState: TState & State = {
	status: 'initial',
	list: [] as TPaymentTypeMethod[],
	item: {} as TPaymentTypeMethod,
	error: '',
};

const slice = createSlice({
	name: 'paymentTypeMethod',
	initialState,
	reducers: {
		...clears(initialState),
		setItem: (state, { payload }) => {
			const id = Number(payload)
			state.item = (
				id
					? state.list.find((item) => item.tipoPagamentoId === payload) ?? {}
					: payload
			) as TPaymentTypeMethod
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefaultRegister(addCase, addPaymentTypeMethod, 'added')
		caseDefaultRegister(addCase, editPaymentTypeMethod, 'edited')

		caseDefault(addCase, fetchPaymentTypeMethod, (state, action) => {
			if (action.payload.items) {
				state.list = action.payload.items ?? [];
				state.item = action.payload.item ?? {};
			} else {
				state.list = [];
				state.item = action.payload ?? {};
			}
		})

	},
});

export default slice;
