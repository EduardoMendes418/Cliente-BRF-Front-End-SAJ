import { createSlice } from '@reduxjs/toolkit';

import { TState } from 'src/core/models';
import { fetchWatsonExportList } from './thunks'

import { clears, caseDefault } from '..';
import { TWatsonList } from '../../../models/watson';

export type TError = { detail: string };

export type State = {
	list: TWatsonList[];
	error: TError;
	listFilters: any
};

const initialState: TState & State = {
	status: 'initial',
	error: {} as TError,
	list: [] as TWatsonList[],
	listFilters: {} as any,

};

const slice = createSlice({
	name: 'watsonExport',
	initialState,
	reducers: {
		...clears(initialState),
		setFilters: (state, { payload }) => {
			state.listFilters = payload
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchWatsonExportList)
	}
});

export default slice;
