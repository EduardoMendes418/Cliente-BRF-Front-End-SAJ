import { createSlice } from '@reduxjs/toolkit';
import { TRequestPension, TPensionClosureReason, TPensionCategory, TRequestPensionFilters } from 'src/core/models/pensions';
import { TState } from 'src/core/models';
import {
	fetchPensionRequest,
	fetchPensionCategories,
	fetchPensionClosureReason,
	addPensionRequest,
	setStatusPensionRequest,
	editPensionRequest
} from './thunks'
import { caseDefault, caseDefaultRegister, clears } from '../..';

export type State = {
	categories: TPensionCategory[];
	closureReason: TPensionClosureReason[];
	list: TRequestPension[];
	listFilters: TRequestPensionFilters;
};

const initialState: TState & State = {
	categories: [] as TPensionCategory[],
	closureReason: [] as TPensionClosureReason[],
	list: [] as TRequestPension[],
	status: 'initial',
	error: '',
	listFilters: {} as TRequestPensionFilters,
};

const slice = createSlice({
	name: 'pensionRequest',
	initialState,
	reducers: {
		...clears(initialState),

		setFilters(state, { payload }) {
			state.listFilters = payload;
		},
	},

	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchPensionRequest)

		caseDefault(addCase, fetchPensionCategories, 'categories')
		caseDefault(addCase, fetchPensionClosureReason, 'closureReason')
		caseDefaultRegister(addCase, setStatusPensionRequest, 'edited')
		caseDefaultRegister(addCase, editPensionRequest, 'edited')
		caseDefaultRegister(addCase, addPensionRequest, 'added')
	},
});

export default slice;
