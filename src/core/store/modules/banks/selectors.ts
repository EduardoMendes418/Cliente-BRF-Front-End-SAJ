import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './index';
import { TBank } from 'src/core/models/banks';

const state = (state: RootState) => state.banks;

export const getBanks = createSelector([state], (state: State) => state.list);

export const getBanksAsOptions = createSelector([getBanks], (list: TBank[]) =>
	list.map(({ name, id }) => ({ label: name, value: id }))
		.sort((a, b) => a.label.localeCompare(b.label))
);

export const getBanksByID = createSelector(
	[getBanks],
	(list) => list.reduce((acc, { id, name }) => {
		if (id) acc[id] = name;
		return acc;
	}, {} as { [key: number]: string })
);
