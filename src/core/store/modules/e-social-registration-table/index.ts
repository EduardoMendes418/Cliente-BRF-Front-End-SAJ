import { createSlice } from '@reduxjs/toolkit';
import { fetchESocialRegistrationTable, editESocialRegistrationTable, addESocialRegistrationTable, fetchStatesESocialTable, fetchCitiesByStateESocialTable } from './thunks';

import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..';
import { TCityESocialTable, TStateESocialTable } from 'src/core/models/state-city';

export type TError = {
	detail: string;
};

export type State = {
	list: any[];
	item: any;
	error: TError;
	listFilters: any;
	states: TStateESocialTable[];
	cities: TCityESocialTable[];
};

const initialState: TState & State = {
	status: 'initial',
	list: [] as any[],
	item: {} as any,
	error: {} as TError,
	listFilters: {} as any,
	states: [] as TStateESocialTable[],
	cities: [] as TCityESocialTable[],
};

const slice = createSlice({
	name: 'eSocialRegistrationTable',
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
		caseDefault(addCase, fetchESocialRegistrationTable)
		caseDefaultRegister(addCase, addESocialRegistrationTable, 'added')
		caseDefaultRegister(addCase, editESocialRegistrationTable, 'edited')
		caseDefault(addCase, fetchStatesESocialTable, 'states')
		caseDefault(addCase, fetchCitiesByStateESocialTable, (state: State, action) => {
			if (state.cities.find((x: { id: any; }) => x.id === action.payload[0].id)) {
				return
			}
			const concat = state.cities.concat(action.payload)
			state.cities = concat
		})

	},
});

export default slice;