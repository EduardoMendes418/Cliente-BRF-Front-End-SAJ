import { createSlice } from '@reduxjs/toolkit';
import * as T from './thunks';

import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..';
import { TSearchESocial, TAutoCompleteESocial } from 'src/core/models/eSocial';

export type TError = {
	detail: string;
};

export type State = TState & {
	list: any[];
	item: any;
	error: any;
	listFilters: any
	search: TSearchESocial
	autocompleteESocialData: TAutoCompleteESocial
};

const initialState: TState & State = {
	status: 'initial',
	list: [] as any[],
	item: {} as any,
	error: {} as TError,
	listFilters: {} as any,
	search: {
		accrualMonth: null,
		eventCode: "",
		folderNumber: "",
		cprb: null
	} as TSearchESocial,
	autocompleteESocialData: {
		admissionDate: "",
		calculationEndDate: "",
		calculationStartDate: "",
		courtPanelNumber: 0,
		courtPanelUF: "",
		processNumber: "",
		registration: "",
		repercussionIndication: 0,
		sentenceDate: "",
		typeOfContract: "",
		workersCPF: "",
		workersName: "",
		cprb: null,
	},
}

const slice = createSlice({
	name: 'eSocialEventLauch',
	initialState,
	reducers: {
		...clears(initialState),
		setItem: (state, action) => {
			state.item = action.payload;
		},
		setFilters: (state, { payload }) => {
			state.listFilters = payload
		},
		setSearch: (state, { payload } : {payload: TSearchESocial}) => {
			state.search = payload
		}
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, T.fetchESocialEventLauch)
		caseDefault(addCase, T.fetchESocialEventLauchGovernmentResponsesById, 'item')
		caseDefaultRegister(addCase, T.addESocialEventLauch, 'added')
		caseDefaultRegister(addCase, T.editESocialEventLauch, 'edited')
		caseDefaultRegister(addCase, T.fetchAutocompleteESocialData, 'imported', (state, action) => {
			state.autocompleteESocialData = action.payload;
		})
	},
});

export default slice;