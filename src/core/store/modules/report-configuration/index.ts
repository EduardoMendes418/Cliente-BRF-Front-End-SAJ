import { createSlice } from '@reduxjs/toolkit';
import {
	fetchReportConfiguration,
	editReportConfiguration,
	addReportConfiguration,
	getReportConfiguration,
	deleteReportConfiguration
} from './thunks';
import { TReportConfiguration, TReportConfigurationFilter } from 'src/core/models/report-configuration';
import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..';

export type TError = {
	id?: number;
	error: { detail: string };
};

export type State = TState & {
	list: TReportConfiguration[];
	item: TReportConfiguration;
	listFilters: { [page: string]: TReportConfigurationFilter }
	reportConfigurationAdded?: number;
};

const initialState: State = {
	status: 'initial',
	list: [] as TReportConfiguration[],
	item: {} as TReportConfiguration,
	error: {} as TError,
	listFilters: {} as { [page: string]: TReportConfigurationFilter },
};

const slice = createSlice({
	name: 'reportConfiguration',
	initialState,
	reducers: {
		...clears(initialState),

		setFilters(state, { payload }) {
			state.listFilters[payload.page] = payload.filters;
		}
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchReportConfiguration)
		caseDefault(addCase, getReportConfiguration, 'item')
		caseDefaultRegister(addCase, addReportConfiguration, 'added', (state, action) => {
			state.reportConfigurationAdded = action.payload;
		})
		caseDefaultRegister(addCase, editReportConfiguration, 'edited')
		caseDefaultRegister(addCase, deleteReportConfiguration, 'deleted')
	},
});

export default slice;
