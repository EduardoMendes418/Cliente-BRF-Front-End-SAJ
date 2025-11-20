import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';

const state = (state: RootState) => state.parameterization;

export const getStatusParameterization = createSelector(
	[state],
	(state) => state.status
);

export const getLoadingParameterization = createSelector(
	[getStatusParameterization],
	(status) => status === 'fetching'
);

export const getSavingParameterization = createSelector(
	[getStatusParameterization],
	(status) => status === 'saving'
);

export const getParameterizationItems = createSelector(
	[state],
	(state) => {
		const obj: { [key: string]: string | number } = {};
		state.items.forEach((item) => (obj[item.name] = item.value));
		return obj;
	}
);
