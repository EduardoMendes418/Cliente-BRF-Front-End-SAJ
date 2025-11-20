import { createSlice } from '@reduxjs/toolkit';

import { TState } from 'src/core/models';
import { TCorrectionRule, TCorrectionRuleFilters } from 'src/core/models/correction-rule';

import { submitCorrectionRules, fetchCorrectionRuleList, editAccountType } from './thunks';
import { caseDefault, caseDefaultRegister, clears } from '..';

export type TError = { detail: string };

export type State = {
	list: TCorrectionRule[];
	listFilters?: TCorrectionRuleFilters;
	item: TCorrectionRule;
	error: TError;
	noCorrectionRuleForFormulaId: boolean;
};

const initialState: TState & State = {
	status: 'initial',
	error: {} as TError,
	list: [] as TCorrectionRule[],
	item: {} as TCorrectionRule,
	noCorrectionRuleForFormulaId: false
};

const slice = createSlice({
	name: 'correctionRule',
	initialState,
	reducers: {
		...clears(initialState),
		setFilters(state, action) {
			state.listFilters = action.payload;
		},

		setNoCorrectionRuleForFormulaId(state, action) {
			state.noCorrectionRuleForFormulaId = action.payload;
		}
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchCorrectionRuleList)
		caseDefaultRegister(addCase, submitCorrectionRules, 'edited')
		caseDefaultRegister(addCase, editAccountType, 'edited')
	}
});

export default slice;
