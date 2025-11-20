import { clears, caseDefaultRegister, caseDefault } from '..';
import { createSlice } from '@reduxjs/toolkit';
import { TState } from 'src/core/models';
import * as F from './thunks';
import * as T from './types';

const initialState: TState & T.State = {
	status: 'initial',
	list: [] as any[],
	item: {} as any,
	error: {} as T.TError,
	listFilters: {} as any,
};

const slice = createSlice({
	name: 'eSocialAreas',
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
		caseDefault(addCase, F.fetchESocialAreasGridList)
		caseDefault(addCase, F.fetchESocialAreasListById)
		caseDefaultRegister(addCase, F.fetchESocialAreasCreate, 'added')
		caseDefaultRegister(addCase, F.fetchESocialAreasUpdate, 'edited')
		caseDefaultRegister(addCase, F.fetchESocialAreasDelete, 'deleted')
	},
});

export default slice;