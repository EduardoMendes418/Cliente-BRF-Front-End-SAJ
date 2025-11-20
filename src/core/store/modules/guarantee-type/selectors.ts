import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { TError } from './index'
import { TOptionsSelect } from 'src/components/form';

const state = (state: RootState) => state.guaranteeType;

export const getListGuaranteeType = createSelector(
	[state],
	(state) => state.list ?? []
);

export const getItemGuaranteeType = createSelector(
	[state],
	(state) => state.item
);

export const getStatusGuaranteeType = createSelector(
	[state],
	(state) => state.status
);

export const getErrorMessageGuaranteeType = createSelector(
	[state],
	({ error }) => error as TError
);

export const getLoadingGuaranteeType = createSelector(
	[state],
	(state) => state.status === 'fetching'
);

export const getListAsOptionsGuaranteeType = createSelector(
	[getListGuaranteeType],
	(list) => {
		return list.reduce((acc, { id, status, description }) => {
			if (id && status) acc.push({ label: description, value: Number(id) })
			return acc
		}, [] as TOptionsSelect[])
	}
)

export const getListFiltersGuaranteeType = createSelector(
	[state],
	({ listFilters }) => listFilters
);