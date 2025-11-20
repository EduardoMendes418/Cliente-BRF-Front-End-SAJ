import { createSlice } from '@reduxjs/toolkit';

import { TState } from 'src/core/models';

import {
	addRejectionAndReturnReason,
	editRejectionAndReturnReason,
	fetchRejectionAndReturnReasonById,
	fetchRejectionAndReturnReasonList
} from './thunks';
import { caseDefault, caseDefaultRegister, clears } from '..';
import { TRejectionAndReturnReason, TRejectionAndReturnReasonFilters } from 'src/core/models/rejection-and-return-reason';

export type TError = { detail: string };

export type State = {
	list: TRejectionAndReturnReason[];
	listFilters?: TRejectionAndReturnReasonFilters;
	item: TRejectionAndReturnReason;
	error: TError;
};

const initialState: TState & State = {
	status: 'initial',
	error: {} as TError,
	list: [] as TRejectionAndReturnReason[],
	listFilters: {} as TRejectionAndReturnReasonFilters,
	item: {} as TRejectionAndReturnReason
};

const slice = createSlice({
	name: 'rejectionAndReturnReason',
	initialState,
	reducers: {
		...clears(initialState),
		
		setFilters(state, { payload }) {
			state.listFilters = payload;
		}
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchRejectionAndReturnReasonList)
		caseDefault(addCase, fetchRejectionAndReturnReasonById, 'item')
		caseDefaultRegister(addCase, addRejectionAndReturnReason, 'added')
		caseDefaultRegister(addCase, editRejectionAndReturnReason, 'edited')
	}
});

export default slice;
