import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';

const state = (state: RootState) => state.stateCity;

export const makeGetCities = (stateId: number) => {
	return createSelector(
		(state: RootState) => state.stateCity,
		(state) => {
			return state.cities.filter(x => x.stateId === stateId)}
	);
}

export const getStates = createSelector(
	[state],
	(state) => state.states
);

export const getStatesAsOptions = createSelector([getStates], (states) => {
	const options: {
		label: string;
		value: number;
	}[] = [];

	states.forEach((state) => {
		if (state.id) options.push({ label: state.name, value: state.id });
	});

	return options;
});

export const makeGetCitiesAsOptions = (stateId: number) => {
	const getCities = makeGetCities(stateId);
	return createSelector(
		[getCities],
		(cities) => {
			const options: { label: string; value: number }[] = [];
			cities.forEach((city) => {
				if (city.id) options.push({ label: city.name, value: city.id });
			});

			return options;
		}
	);
}

export const getStateCityIsFetching = createSelector(
	[state],
	(state) => state.status === 'fetching'
);
