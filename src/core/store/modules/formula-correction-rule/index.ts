import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TState } from 'src/core/models';
import { TFormulaCorrectionRule, TFormulaCorrectionRuleFilters } from 'src/core/models/formula-correction-rule';

import {
	addFormulaCorrectionRule,
	deleteFormulaCorrectionRule,
	fetchFormulaCorrectionRuleById,
	fetchFormulaCorrectionRuleList,
	editFormulaCorrectionRule,
	fetchFormulaCorrectionRuleOptions
} from './thunks';
import { caseDefault, caseDefaultRegister, clears } from '..';

export type TError = { detail: string };

export type State = {
	list: TFormulaCorrectionRule[];
	listFilters: TFormulaCorrectionRuleFilters;
	listOptions: TFormulaCorrectionRule[];
	item: TFormulaCorrectionRule;
	error: TError;
};

const initialState: TState & State = {
	status: 'initial',
	listFilters: {},
	error: {} as TError,
	list: [] as TFormulaCorrectionRule[],
	listOptions: [],
	item: {} as TFormulaCorrectionRule
};

const slice = createSlice({
	name: 'formulaCorrectionRule',
	initialState,
	reducers: {
		...clears(initialState),
		setFilters(state, action: PayloadAction<TFormulaCorrectionRuleFilters>) {
			state.listFilters = action.payload;
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchFormulaCorrectionRuleList)
		caseDefault(addCase, fetchFormulaCorrectionRuleOptions, { listOptions: 'items' })
		caseDefault(addCase, fetchFormulaCorrectionRuleById, 'item')
		caseDefaultRegister(addCase, deleteFormulaCorrectionRule, 'deleted')
		caseDefaultRegister(addCase, editFormulaCorrectionRule, 'edited')

		addCase(addFormulaCorrectionRule.pending, (state) => {
			state.status = 'fetching';
		});

		addCase(addFormulaCorrectionRule.fulfilled, (state, action) => {
			state.item = action.payload ?? {};
			state.status = 'added';
		});

		addCase(addFormulaCorrectionRule.rejected, (state, action) => {
			state.status = 'failure';
			state.error = action.payload as TError;
		});
	}
});

export default slice;
