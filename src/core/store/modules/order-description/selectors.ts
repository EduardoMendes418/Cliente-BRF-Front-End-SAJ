import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { TError } from './index'
import { TOptionsSelect } from 'src/components/form';

const state = (state: RootState) => state.orderDescription;

export const getListOrderDescription = createSelector(
	[state],
	(state) => state.list ?? []

);
export const getItemOrderDescription = createSelector(
	[state],
	(state) => state.item
);

export const getLoadingOrderDescription = createSelector(
	[state],
	(state) => state.status === 'fetching'
);

export const getStatusOrderDescription = createSelector(
	[state],
	(state) => state.status
);

export const getErrorMessageOrderDescription = createSelector(
	[state],
	({ error }) => error as TError
);

export const getListFiltersOrderDescription = createSelector(
	[state],
	({ listFilters }) => listFilters
);

type TOrderDescriptionOption = TOptionsSelect & { areaId?: number }

export const getListAsOptionsOrderDescription = createSelector(
	[getListOrderDescription],
	(list) => {
		return list.reduce((acc, { id, name, areaId }) => {
			if (id) acc.push({ label: name, value: Number(id), areaId })
			return acc
		}, [] as TOrderDescriptionOption[])
	}
);