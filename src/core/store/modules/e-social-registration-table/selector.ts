import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.eSocialRegistrationTable;

export const getListESocialRegistrationTable = createSelector(
	[state],
	({ list }: State) => list
);

export const getListFiltersESocialRegistrationTable = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getLoadingESocialRegistrationTable = createSelector(
	[state],
	(state) => state.status === 'fetching'
);

export const makeGetCitiesESocialRegistrationTable = (stateId: number) => {
	return createSelector(
		(state: RootState) => state.eSocialRegistrationTable,
		(state) => {
			return state.cities.filter(x => x.stateId === stateId) 
		}
	);
}

export const makeGetCitiesESocialRegistrationTableAsOptions = (stateId: number) => {
	const getCities = makeGetCitiesESocialRegistrationTable(stateId);
	return createSelector(
		[getCities],
		(cities) => {
		
			const options: { label: string; value: string }[] = [];
			cities.forEach((city) => {
				if (city.id) options.push({ label: city.description, value: city.code });
			}); 

			return options;
		}
	);
}

export const getStatesESocialTable = createSelector(
	[state],
	(state) => state.states
);

export const getStatesAsOptionsESocialTable = createSelector([getStatesESocialTable], (states) => {
	const options: {
		label: string;
		value: number;
	}[] = [];

	return options;
});