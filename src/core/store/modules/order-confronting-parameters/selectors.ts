import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { TOptionsSelect } from 'src/components/form';

import { TError } from './index'

const state = (state: RootState) => state.orderConfrontingParameters;

export const getListOrderConfronting = createSelector(
	[state],
	(state) => state.list ?? []
);

export const getStatusOrderConfronting = createSelector(
	[state],
	(state) => state.status
);

export const getErrorMessageOrderConfronting = createSelector(
	[state],
	({ error }) => error as TError
);

export const getLoadingOrderConfronting = createSelector(
	[state],
	(state) => state.status === 'fetching'
);

export const getListAsOptionsOrderConfronting = createSelector(
	[getListOrderConfronting],
	(list) => {
		return list.reduce((acc, { id, areaDejurName }) => {
			if (id) acc.push({ label: areaDejurName, value: Number(id) })
			return acc
		}, [] as TOptionsSelect[])
	}
);

export const getItemOrderConfronting = createSelector(
	[state],
	(state) => state.item
);

export const getListFiltersOrderConfronting = createSelector(
	[state],
	({ listFilters }) => listFilters
)