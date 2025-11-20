import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.formulaCorrectionRule;

export const getListFormulaCorrectionRule = createSelector(
	[state],
	({ list }: State) => list
);

export const getListFiltersFormulaCorrectionRule = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getItemFormulaCorrectionRule = createSelector(
	[state],
	({ item }) => item
);

export const getHasItemFormulaCorrectionRule = createSelector(
	[state],
	({ item }) => !!item.id
);

export const getStatusFormulaCorrectionRule = createSelector(
	[state],
	({ status }) => status
);

export const getLoadingFormulaCorrectionRule = createSelector(
	[state],
	({ status }) => status === 'fetching'
);

export const getErrorMessageFormulaCorrectionRule = createSelector(
	[state],
	({ error }: State): string => {
		if (!error) return '';

		if (typeof error === 'object' && error !== null) return (error as any).error;

		return error as string;
	}
);

export const getListFormulaCorrectionRuleAsOptionsFromList = createSelector([getListFormulaCorrectionRule], (list) =>
	list.map(({ formulaName, id }) => ({ label: formulaName, value: Number(id) }))
);

export const getListFormulaCorrectionRuleAsOptions = createSelector(
	[state],
	({ listOptions }: State) => listOptions.map((option => ({
		label: option.formulaName,
		value: Number(option.id)
	})))
);
