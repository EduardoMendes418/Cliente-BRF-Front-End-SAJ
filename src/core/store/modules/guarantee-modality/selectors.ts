import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.guaranteeModality;

export const getListGuaranteeModality = createSelector(
	[state],
	({ list }: State) => list
);

export const getItemGuaranteeModality = createSelector(
	[state],
	(state) => state.item
);

export const getStatusGuaranteeModality = createSelector(
	[state],
	(state) => state.status
);

export const getErrorMessageGuaranteeModality = createSelector(
	[state],
	({ error }: State): string => {
		if (error?.detail && error?.detail.includes('Record already exists in the database'))
			return 'Registro duplicado'
		else return error?.detail
	}
);

export const getLoadingGuaranteeModality = createSelector(
	[state],
	(state) => state.status === 'fetching'
);

export const getListFiltersGuaranteeModality = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);