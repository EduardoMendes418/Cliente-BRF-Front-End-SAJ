import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.economicIndices;

export const getListEconomicIndices = createSelector(
	[state],
	({ list }: State) => list
);

export const getItemEconomicIndices = createSelector(
	[state],
	({ item }) => item
);

export const getStatusEconomicIndices = createSelector(
	[state],
	({ status }) => status
);

export const getLoadingEconomicIndices = createSelector(
	[state],
	({ status }) => status === 'fetching'
);

export const getErrorMessageEconomicIndices = createSelector(
	[state],
	({ error }: State): string => error?.detail
);

export const getListFiltersEconomicIndices = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getListEconomicIndicesAsOptions = createSelector([getListEconomicIndices], (list) =>
	list.filter((item => item.status)).map(({ name, id }) => ({ label: name, value: Number(id) }))
);
