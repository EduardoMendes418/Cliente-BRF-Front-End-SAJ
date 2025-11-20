import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	addLegalDocCoverage,
	editLegalDocCoverage,
	fetchLegalDocCoverage,
	getLegalDocCoverage,
} from './thunks';
import { TLegalDoc, TLegalDocFilter } from 'src/core/models/legal-document-coverages';
import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..';

export type TError = { detail: string }

export type TLegalDocCoverageState = {
	list: TLegalDoc[];
	item?: TLegalDoc;
	listFilters: TLegalDocFilter;
	error?: TError
};

const initialState: TState & TLegalDocCoverageState = {
	status: 'initial',
	list: [],
	item: undefined,
	listFilters: {} as TLegalDocFilter,
};

const slice = createSlice({
	name: 'legalDocCoverage',
	initialState,
	reducers: {
		...clears(initialState),

		setItem: (state, action: PayloadAction<TLegalDoc>) => {
			state.item = action.payload;
		},

		setFilters: (state, { payload }: PayloadAction<TLegalDocFilter>) => {
			state.listFilters = payload
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchLegalDocCoverage)
		caseDefault(addCase, getLegalDocCoverage, 'item')
		caseDefaultRegister(addCase, addLegalDocCoverage, 'added')
		caseDefaultRegister(addCase, editLegalDocCoverage, 'edited')
	},
});

export default slice;
