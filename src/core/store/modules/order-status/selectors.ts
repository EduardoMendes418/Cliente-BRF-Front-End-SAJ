import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { TError } from './index'
import { TOptionsSelect } from 'src/components/form';

const state = (state: RootState) => state.orderStatus;

export const getListOrderStatus = createSelector(
	[state],
	(state) => state.list ?? []
);

export const getStatusOrderStatus = createSelector(
	[state],
	(state) => state.status
);

export const getErrorMessageOrderStatus = createSelector(
	[state],
	({ error }) => error as TError
);

export const getLoadingOrderStatus = createSelector(
	[state],
	(state) => state.status === 'fetching'
);

export const getListAsOptionsOrderStatus = createSelector(
	[getListOrderStatus],
	(list) => {
		return list.reduce((acc, { id, name }) => {
			if (id) acc.push({ label: name, value: Number(id) })
			return acc
		}, [] as TOptionsSelect[])
	}
);

export const getItemOrderStatus = createSelector(
	[state],
	(state) => state.item
);

export const getListFiltersOrderStatus = createSelector(
	[state],
	({ listFilters }) => listFilters
)
