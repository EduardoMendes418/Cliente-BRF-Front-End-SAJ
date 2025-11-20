import { createSlice } from '@reduxjs/toolkit';

import { TDejurAreaFilter, TState } from 'src/core/models';
import { TCivilMass } from 'src/core/models/civil-mass';

import { addCivilMass, editCivilMass, fetchCivilMassById, fetchCivilMassList } from './thunks';
import { caseDefault, caseDefaultRegister, clears } from '..';

export type TError = { detail: string };

export type State = {
	list: TCivilMass[];
	listFilters?: TDejurAreaFilter;
	item: TCivilMass;
	error: TError;
};

const initialState: TState & State = {
	status: 'initial',
	error: {} as TError,
	list: [] as TCivilMass[],
	item: {} as TCivilMass
};

const slice = createSlice({
	name: 'civilMass',
	initialState,
	reducers: {
		...clears(initialState),
		setFilters(state, action) {
			state.listFilters = action.payload;
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchCivilMassList)
		caseDefault(addCase, fetchCivilMassById, 'item')
		caseDefaultRegister(addCase, addCivilMass, 'added')
		caseDefaultRegister(addCase, editCivilMass, 'edited')
	}
});

export default slice;
