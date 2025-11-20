import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	addLegalDocServiceOpinions,
	editLegalDocServiceOpinions,
	fetchLegalDocServiceOpinions,
	getLegalDocServiceOpinions,
} from './thunks';
import { TLegalDocServiceOpinion, TLegalDocServiceOpinionFilter } from 'src/core/models/legal-document-service-opinions';
import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..';

export type TError = { detail: string }

export type TLegalDocServiceOpinionsState = {
	list: TLegalDocServiceOpinion[];
	item?: TLegalDocServiceOpinion;
	listFilters: TLegalDocServiceOpinionFilter;
	error?: TError
};

const initialState: TState & TLegalDocServiceOpinionsState = {
	status: 'initial',
	list: [],
	item: undefined,
	listFilters: {} as TLegalDocServiceOpinionFilter,
};

const slice = createSlice({
	name: 'legalDocServiceOpinions',
	initialState,
	reducers: {
		...clears(initialState),

		setItem: (state, action: PayloadAction<TLegalDocServiceOpinion>) => {
			state.item = action.payload;
		},

		setFilters: (state, { payload }: PayloadAction<TLegalDocServiceOpinionFilter>) => {
			state.listFilters = payload
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchLegalDocServiceOpinions)
		caseDefault(addCase, getLegalDocServiceOpinions, 'item')
		caseDefaultRegister(addCase, addLegalDocServiceOpinions, 'added')
		caseDefaultRegister(addCase, editLegalDocServiceOpinions, 'edited')
	},
});

export default slice;
