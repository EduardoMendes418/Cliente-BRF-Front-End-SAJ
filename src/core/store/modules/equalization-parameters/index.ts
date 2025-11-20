import { createSlice } from '@reduxjs/toolkit';

import { TState, TDejurAreaFilter } from 'src/core/models';
import { TEqualizationParameters } from 'src/core/models/equalization-parameters';

import {
	addEqualizationParameters,
	editEqualizationParameters,
	fetchEqualizationParametersList,
	fetchEqualizationParametersById,
	runEqualization
} from './thunks';
import { caseDefault, caseDefaultRegister, clears } from '..';

export type TError = { detail: string };

export type State = {
	list: TEqualizationParameters[];
	listFilters: { [page: string]: TDejurAreaFilter };
	item: TEqualizationParameters;
	error: TError;
};

const initialState: TState & State = {
	status: 'initial',
	error: {} as TError,
	list: [] as TEqualizationParameters[],
	item: {} as TEqualizationParameters,
	listFilters: {} as { [page: string]: TDejurAreaFilter },
};

const slice = createSlice({
	name: 'equalizationParameters',
	initialState,
	reducers: {
		...clears(initialState),
		setFilters(state, { payload }) {
			state.listFilters[payload.page] = payload.filters;
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchEqualizationParametersList)
		caseDefault(addCase, fetchEqualizationParametersById, 'item')
		caseDefaultRegister(addCase, addEqualizationParameters, 'added')
		caseDefaultRegister(addCase, editEqualizationParameters, 'edited')
		caseDefaultRegister(addCase, runEqualization, 'added')
	}
});

export default slice;
