import { createSlice } from '@reduxjs/toolkit';
import {
	fetchReportDictionary,
} from './thunks';
import { TReportDictionary, TReportDictionaryFilter } from 'src/core/models/report-dictionary';
import { TState } from 'src/core/models';
import { clears, caseDefault } from '..';

export type TError = {
	id?: number;
	error: { detail: string };
};

export type State = TState & {
	list: TReportDictionary[];
	listFilters: TReportDictionaryFilter;
};

const initialState: State = {
	status: 'initial',
	list: [] as TReportDictionary[],
	error: {} as TError,
	listFilters: {} as TReportDictionaryFilter,
};

const slice = createSlice({
	name: 'reportDictionary',
	initialState,
	reducers: {
		...clears(initialState),
		setFilters(state, { payload }) {
			state.listFilters = payload;
		}
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchReportDictionary, (state, action) => {
			state.list = action.payload
		})
	}
});

export default slice;
