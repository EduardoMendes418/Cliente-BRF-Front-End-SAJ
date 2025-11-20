import { createSlice } from '@reduxjs/toolkit';
import {
	fetchRequestParameters,
	getRequestParameters,
	addRequestParameters,
	editRequestParameters,
} from './thunks';
import { TRequestParameters, TRequestParametersFilters } from 'src/core/models/request-parameters';
import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..';

export type TError = { detail: string };

export type State = {
	list: TRequestParameters[];
	item: TRequestParameters;
	listFilters: TRequestParametersFilters;
	error: TError;
};


export const initialState: TState & State = {
	status: 'initial',
	list: [] as TRequestParameters[],
	item: {} as TRequestParameters,
	listFilters: {} as TRequestParametersFilters,
	error: {} as TError
};

const slice = createSlice({
	name: 'requestParameters',
	initialState,
	reducers: {
		...clears(initialState),
		setItem: (state, { payload }) => {
			state.item = payload ?? {} as TRequestParameters
		},

		setFilters(state, { payload }) {
			state.listFilters = payload ?? {} as TRequestParametersFilters
		},
		clearItem: (state) => {
			state.item = initialState.item
		}
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchRequestParameters)
		caseDefault(addCase, getRequestParameters, 'item')
		caseDefaultRegister(addCase, addRequestParameters, 'added')
		caseDefaultRegister(addCase, editRequestParameters, 'edited')
	},
});

export default slice;
