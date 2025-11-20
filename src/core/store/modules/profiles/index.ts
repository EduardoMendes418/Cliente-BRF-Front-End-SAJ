import { createSlice } from '@reduxjs/toolkit';
import {
	fetchProfiles,
	getProfiles,
	addProfiles,
	editProfiles,
} from './thunks';
import { TProfiles, TProfilesFilters } from 'src/core/models/profiles';
import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..';

export type TError = { detail: string };

export type State = {
	list: TProfiles[];
	item: TProfiles;
	listFilters: TProfilesFilters;
	error: TError;
};


export const initialState: TState & State = {
	status: 'initial',
	list: [] as TProfiles[],
	item: {} as TProfiles,
	listFilters: {} as TProfilesFilters,
	error: {} as TError
};

const slice = createSlice({
	name: 'profiles',
	initialState,
	reducers: {
		...clears(initialState),
		setItem: (state, { payload }) => {
			state.item = payload ?? {} as TProfiles
		},

		setFilters(state, { payload }) {
			state.listFilters = payload ?? {} as TProfilesFilters
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchProfiles)
		caseDefault(addCase, getProfiles, 'item')
		caseDefaultRegister(addCase, addProfiles, 'added')
		caseDefaultRegister(addCase, editProfiles, 'edited')
	},
});

export default slice;
