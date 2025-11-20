import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { TError } from './index'
import { TOptionsSelect } from 'src/components/form';

const state = (state: RootState) => state.guaranteeMethod;

export const getListGuaranteeMethod = createSelector(
	[state],
	(state) => state.list ?? []
);

export const getItemGuaranteeMethod = createSelector(
	[state],
	(state) => state.item
);

export const getStatusGuaranteeMethod = createSelector(
	[state],
	(state) => state.status
);

export const getErrorMessageGuaranteeMethod = createSelector(
	[state],
	({ error }) => error as TError
);

export const getLoadingGuaranteeMethod = createSelector(
	[state],
	(state) => state.status === 'fetching'
);

export const getListAsOptionsGuaranteeMethod = createSelector(
	[getListGuaranteeMethod],
	(list) => {
		return list.reduce((acc, { id, status, description }) => {
			if (id && status) acc.push({ label: description, value: Number(id) })
			return acc
		}, [] as TOptionsSelect[])
	}
)

export const getListFiltersLoadingGuaranteeMethod = createSelector(
	[state],
	({ listFilters }) => listFilters
);