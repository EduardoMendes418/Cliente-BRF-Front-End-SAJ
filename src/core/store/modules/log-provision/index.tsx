import { createSlice } from '@reduxjs/toolkit';
import { caseDefault, clears } from '../';
import { TState } from 'src/core/models';
import {
	fetchLogProvisionSumOfValues,
	fetchLogProvisioList
} from './thunks'
import { TLogProvisionParameters, TLogProvision } from '../../../models/log-provision';

export type TError = { detail: string };

export type State = {
	error: TError;
	sumOfValues: any;
	list: TLogProvision[];
	listFilters: { [page: string]: TLogProvisionParameters };
};

const initialState: TState & State = {
	status: 'initial',
	error: {} as TError,
	sumOfValues: null,
	listFilters: {} as { [page: string]: TLogProvisionParameters },
	list: [] as TLogProvision[],

};

const slice = createSlice({
	name: 'logProvison',
	initialState,
	reducers: {
		...clears(initialState),
		setFilter: (state: any, { payload }: any) => {
			state.listFilters[payload.page] = payload.filters;
		}
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchLogProvisioList)
		caseDefault(addCase, fetchLogProvisionSumOfValues, 'sumOfValues')
	},
});

export default slice;
