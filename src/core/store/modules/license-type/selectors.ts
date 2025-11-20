import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { TError } from './index'
import { TOptionsSelect } from 'src/components/form';

const state = (state: RootState) => state.licenseType;

export const getListLicenseType = createSelector(
	[state],
	(state) => state.list ?? []
);

export const getItemLicenseType = createSelector(
	[state],
	(state) => state.item
);

export const getStatusLicenseType = createSelector(
	[state],
	(state) => state.status
);

export const getErrorMessageLicenseType = createSelector(
	[state],
	({ error }) => error as TError
);

export const getLoadingLicenseType = createSelector(
	[state],
	(state) => state.status === 'fetching'
);

export const getListAsOptionsLicenseType = createSelector(
	[getListLicenseType],
	(list) => {
		return list.reduce((acc, { id, status, description }) => {
			if (id && status) acc.push({ label: description, value: Number(id) })
			return acc
		}, [] as TOptionsSelect[])
	}
)


export const getListFiltersLicenseType = createSelector(
	[state],
	({ listFilters }) => listFilters
);