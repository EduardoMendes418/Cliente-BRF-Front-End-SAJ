import { createSlice } from '@reduxjs/toolkit';
import { TLegalDoc, TLegalDocFilter } from 'src/core/models/legal-document-request';
import { TState } from 'src/core/models';
import { clears, caseDefault, caseDefaultRegister } from '..';
import { fetchLegalDocRequest, addLegalDocRequest, getLegalDocRequest, editLegalDocRequest } from './thunks';

export type State = {
	list: TLegalDoc[];
	listFilters: Partial<TLegalDocFilter>;
	item?: TLegalDoc;
};

const initialState: TState & State = {
	listFilters: {} as Partial<TLegalDocFilter>,
	list: [] as TLegalDoc[],
	item: {} as TLegalDoc,
	status: 'initial',
	error: '',
};

const slice = createSlice({
	name: 'legalDocumentRequest',
	initialState,
	reducers: {
		...clears(initialState),

		setFilters(state, { payload }) {
			state.listFilters = payload;
		},

		setItem: (state, action) => {
			state.item = action.payload;
		},

	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchLegalDocRequest)
		caseDefault(addCase, getLegalDocRequest, 'item')
		caseDefaultRegister(addCase, addLegalDocRequest, 'added')
		caseDefaultRegister(addCase, editLegalDocRequest, 'edited')
	},
});

export default slice;
