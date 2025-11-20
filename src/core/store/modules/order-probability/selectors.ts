import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { TError } from './index'
import { TOptionsSelect } from 'src/components/form';

const state = (state: RootState) => state.orderProbability;

export const getListOrderProbability = createSelector(
	[state],
	(state) => state.list ?? []
);

export const getStatusOrderProbability = createSelector(
	[state],
	(state) => state.status
);

export const getErrorMessageOrderProbability = createSelector(
	[state],
	({ error }) => error as TError
);

export const getLoadingOrderProbability = createSelector(
	[state],
	(state) => state.status === 'fetching'
);

export const getListAsOptionsOrderProbability = createSelector(
	[getListOrderProbability],
	(list) => {
		return list.reduce((acc, { id, name }) => {
			if (id) acc.push({ label: name, value: Number(id) })
			return acc
		}, [] as TOptionsSelect[])
	}
);

export const getItemOrderProbability = createSelector(
	[state],
	(state) => state.item
);

export const getListFiltersOrderProbability = createSelector(
	[state],
	({ listFilters }) => listFilters
)
