import { createSlice } from '@reduxjs/toolkit';

import { TState } from 'src/core/models';
import { fetchWatsonSettings, addWatsonSettings, getWatsonSettings } from './thunks'

import { clears, caseDefault, caseDefaultRegister } from '..';
import { TWatsonParameters } from '../../../models/watson';

export type TError = { detail: string };

export type State = {
	list: TWatsonParameters[];
	item: TWatsonParameters;
	error: TError;
};

const initialState: TState & State = {
	status: 'initial',
	error: {} as TError,
	item: {} as TWatsonParameters,
	list: [] as TWatsonParameters[]
};

const slice = createSlice({
	name: 'watsonSettings',
	initialState,
	reducers: {
		...clears(initialState)
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchWatsonSettings, 'list')
		caseDefault(addCase, getWatsonSettings, 'item')
		caseDefaultRegister(addCase, addWatsonSettings, 'added')
	}
});

export default slice;
