import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { TError } from './index'
import { TOptionsSelect } from 'src/components/form';

const state = (state: RootState) => state.orderRatingDescription;

export const getErrorMessageOrderRatingDescription = createSelector(
	[state],
	({ error }) => error as TError
);

export const getItemOrderRatingDescription = createSelector(
	[state],
	(state) => state.item
);

export const getLoadingOrderRatingDescription = createSelector(
	[state],
	(state) => state.status === 'fetching'
);

export const getStatusOrderRatingDescription = createSelector(
	[state],
	(state) => state.status
);

export const getListOrderRatingDescription = createSelector(
	[state],
	(state) => state.list ?? []
);

export const getListFiltersOrderRatingDescription = createSelector(
	[state],
	({ listFilters }) => listFilters
);

export const getListAsOptionsOrderRatingDescription = createSelector(
	[getListOrderRatingDescription],
	(list) => {
		return list.reduce((acc, { id, name }) => {
			if (id) acc.push({ label: name, value: Number(id) })
			return acc
		}, [] as TOptionsSelect[])
	}
)