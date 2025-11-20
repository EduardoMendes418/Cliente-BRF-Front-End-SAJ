import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../index';

const state = (state: RootState) => state.sapHierarchy;

export const getSapHierarchyItem = createSelector(
	[state],
	(state) => state.item,
);

export const getSapHierarchyStatus = createSelector(
	[state],
	(state) => state.status,
);

export const getSapHierarchyError = createSelector([state], (state) => {
	return state.error;
});

export const getSapHierarchyErrorMessage = createSelector(
	[getSapHierarchyError],
	(error): string => {
		if (!error || !error.error) return '';

		return error.error;
	},
);

export const getSapHierarchyIsFetching = createSelector(
	[state],
	(state) => state.status === 'fetching',
);

export const getSapHierarchyIsFailure = createSelector(
	[state],
	(state) => state.status === 'failure',
);

export const getSapHierarchyIsEmpty = createSelector(
	[getSapHierarchyItem, getSapHierarchyError],
	(item, isFetching) => !item && !isFetching,
);
