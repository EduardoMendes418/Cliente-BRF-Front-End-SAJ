import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'src/core/store';
import { State, TError } from './index'
import { TOptionsSelect } from 'src/components/form';
type TWatsonSearchFilter = {
	id: number, 
	nameFilter: string, 
	statusFilter: boolean
}

const state = (state: RootState) => state.watson;

export const getListWatson = createSelector(
	[state],
	({ list }: State) => list
);

export const getItemWatson = createSelector(
	[state],
	({ item }) => item
);

export const getStatusWatson = createSelector(
	[state],
	({ status }) => status
);

export const getErrorMessageWatson = createSelector(
	[state],
	({ error }) => error as TError
);

export const getListAsOptionsGuaranteeType = createSelector(
	[getListWatson],
	(list) => {
		return list.filter(({statusFilter}:TWatsonSearchFilter) => statusFilter).map((item: TWatsonSearchFilter) => ({value: item.id, label:item.nameFilter}), [] as TOptionsSelect[])
	}
)