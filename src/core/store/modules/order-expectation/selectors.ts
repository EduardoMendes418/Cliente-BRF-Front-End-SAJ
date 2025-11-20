import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { TError } from './index'
import { TOptionsSelect } from 'src/components/form';

const state = (state: RootState) => state.orderExpectation;

export const getListOrderExpectation = createSelector(
	[state],
	(state) => state.list ?? []
);

export const getStatusOrderExpectation = createSelector(
	[state],
	(state) => state.status
);

export const getErrorMessageOrderExpectation = createSelector(
	[state],
	({ error }) => error as TError
);

export const getLoadingOrderExpectation = createSelector(
	[state],
	(state) => state.status === 'fetching'
);

export const getListAsOptionsOrderExpectation = createSelector(
	[getListOrderExpectation],
	(list) => {
		return list.reduce((acc, { id, name }) => {
			if (id) acc.push({label: name, value: Number(id)})
			return acc
		}, [] as TOptionsSelect[])
	}
);

export const getItemOrderExpectation = createSelector(
	[state],
	(state) => state.item
);

export const getListFiltersOrderExpectation = createSelector(
	[state],
	({ listFilters }) => listFilters
)