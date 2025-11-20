import { clears, caseDefaultRegister, caseDefault } from '..';
import { createSlice } from '@reduxjs/toolkit';
import * as F from './thunks';

export type State = {
	list: any[];
	item: any;
	error: any;
	listFilters: any
};

const initialState: any  = {
	status: 'initial',
	list: [] as any[],
	item: {} as any,
	error: {} as any,
	listFilters: {} as any,
};

const slice = createSlice({
	name: 'eSocialClosure',
	initialState,
	reducers: {
		...clears(initialState),

		setItem: (state, action) => {
			state.item = action.payload;
		},

		setFilters: (state, { payload }) => {
			state.listFilters = payload
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, F.fetchESocialClosureEmployer)
		caseDefault(addCase, F.fetchESocialClosureEmployerListById)
		caseDefaultRegister(addCase, F.fetchESocialClosureEmployerCreate, 'added')
		caseDefaultRegister(addCase, F.fetchESocialClosureEmployerUpdate, 'edited')
		caseDefaultRegister(addCase, F.fetchESocialClosureEmployerDelete, 'deleted')
	},
});

export default slice;