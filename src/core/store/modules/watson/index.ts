import { createSlice } from '@reduxjs/toolkit';

import { TState } from 'src/core/models';
import { fetchWatsonList, addWatson, getWatsonItem, editWatson, deleteWatson } from './thunks';

import { clears, caseDefaultRegister, caseDefault } from '..';
import { TWatson } from '../../../models/watson';

export type TError = { detail: string };

export type State = {
	list: any;
	item: TWatson;
	error: TError;
};

const initialState: TState & State = {
	status: 'initial',
	error: {} as TError,
	list: [] as TWatson[],
	item: {} as TWatson,
};

const slice = createSlice({
	name: 'watson',
	initialState,
	reducers: {
		...clears(initialState)
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchWatsonList)
		caseDefault(addCase, getWatsonItem, 'item')
		caseDefaultRegister(addCase, addWatson, 'added')
		caseDefaultRegister(addCase, editWatson, 'edited')
		caseDefaultRegister(addCase, deleteWatson, 'deleted')
	}
});

export default slice;
