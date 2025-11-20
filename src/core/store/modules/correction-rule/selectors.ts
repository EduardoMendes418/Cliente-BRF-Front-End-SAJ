import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.correctionRule;

export const getListCorrectionRule = createSelector(
	[state],
	({ list }: State) => list
);

export const getItemCorrectionRule = createSelector(
	[state],
	({ item }) => item
);

export const getStatusCorrectionRule = createSelector(
	[state],
	({ status }) => status
);

export const getLoadingCorrectionRule = createSelector(
	[state],
	({ status }) => status === 'fetching'
);

export const getListFiltersCorrectionRule = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getErrorMessageCorrectionRule = createSelector(
	[state],
	({ error }: State): string => {
		if (!error) return '';

		if (typeof error === 'object' && error !== null) return (error as any).error;

		return error as string;
	}
);

export const getNoCorrectionRuleForFormulaId = createSelector(
	[state],
	({ noCorrectionRuleForFormulaId, listFilters }: State) => noCorrectionRuleForFormulaId && !!listFilters?.formulaCorrectionRuleId
);
