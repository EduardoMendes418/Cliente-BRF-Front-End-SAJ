import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	addLegalDocReqStatus,
	editLegalDocReqStatus,
	fetchLegalDocReqStatus,
	getLegalDocReqStatus,
} from './thunks';
import { TLegalDocReqStatus, TLegalDocReqStatusFilter } from 'src/core/models/legal-document-request-status';
import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..';

export type TError = { detail: string }

export type TLegalDocReqStatusState = {
	list: TLegalDocReqStatus[];
	item?: TLegalDocReqStatus;
	listFilters: TLegalDocReqStatusFilter;
	error?: TError
};

const initialState: TState & TLegalDocReqStatusState = {
	status: 'initial',
	list: [],
	item: undefined,
	listFilters: {} as TLegalDocReqStatusFilter,
};

const slice = createSlice({
	name: 'legalDocReqStatus',
	initialState,
	reducers: {
		...clears(initialState),

		setItem: (state, action: PayloadAction<TLegalDocReqStatus>) => {
			state.item = action.payload;
		},

		setFilters: (state, { payload }: PayloadAction<TLegalDocReqStatusFilter>) => {
			state.listFilters = payload
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchLegalDocReqStatus)
		caseDefault(addCase, getLegalDocReqStatus, 'item')
		caseDefaultRegister(addCase, addLegalDocReqStatus, 'added')
		caseDefaultRegister(addCase, editLegalDocReqStatus, 'edited')
	},
});

export default slice;
