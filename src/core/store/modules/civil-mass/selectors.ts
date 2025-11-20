import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.civilMass;

export const getListCivilMass = createSelector(
	[state],
	({ list }: State) => list
);

export const getItemCivilMass = createSelector(
	[state],
	({ item }) => item
);

export const getStatusCivilMass = createSelector(
	[state],
	({ status }) => status
);

export const getLoadingCivilMass = createSelector(
	[state],
	({ status }) => status === 'fetching'
);

export const getListFiltersCivilMass = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getErrorMessageCivilMass = createSelector(
	[state],
	({ error }: State): string => {
		if (!error) return '';

		if (typeof error === 'object' && error !== null) return (error as any).error;

		return error as string;
	}
);
