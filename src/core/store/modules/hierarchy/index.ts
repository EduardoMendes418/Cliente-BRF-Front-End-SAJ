import { createSlice } from '@reduxjs/toolkit';
import { addHierarchy, fetchHierarchy, deleteHierarchy, fetchHierarchyList } from './thunks';
import { THierarchy, THierarchyList, THierarchyFilter } from '../../../models/hierarchy';
import { TState } from 'src/core/models';
import { caseDefault, caseDefaultRegister, clears } from '..'

export type Error = {
	id?: number;
	error: { detail: string };
};

export type State = {
	list: THierarchy[];
	item: THierarchy;
	error: Error;
	juridicalArea: string | undefined;
	hierarchy: string | undefined;
	nomeAprovador: string | undefined;
	hierarchyListFlow: THierarchyList[];
	listFilters?: THierarchyFilter;
};

const initialState: TState & State = {
	status: 'initial',
	list: [] as THierarchy[],
	item: {} as THierarchy,
	error: {} as Error,
	juridicalArea: undefined,
	hierarchy: undefined,
	nomeAprovador: undefined,
	hierarchyListFlow: [] as THierarchyList[],
};

const slice = createSlice({
	name: 'hierarchy',
	initialState,
	reducers: {
		...clears(initialState),
		changeJuridicalArea(state, action) {
			state.juridicalArea = action.payload;
		},
		 setFilters(state, action) {
			state.listFilters = action.payload;
		}, 
		setItem: (state, action) => {
			state.item = action.payload;
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefaultRegister(addCase, addHierarchy, 'added')
		caseDefaultRegister(addCase, deleteHierarchy, 'deleted')

		caseDefault(addCase, fetchHierarchyList, (state, action) => {
			state.hierarchyListFlow = action.payload ?? [];
		})

		caseDefault(addCase, fetchHierarchy, (state, action) => {
			state.list = action.payload.items ?? [];
			state.item = action.payload.item ?? {};
		})
	},
});

export default slice;
