import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../index';

const state = (state: RootState) => state.hierarchy;

export const getHierarchyList = createSelector(
	[state],
	(state) => state.list,
);

export const getHierarchyItem = createSelector(
	[state],
	(state) => state.item,
);

export const getHierarchyJuridicalArea = createSelector(
	[state],
	(state) => state.juridicalArea
);

export const getHierarchyStatus = createSelector(
	[state],
	(state) => state.status,
);

export const getHierarchyError = createSelector([state], (state) => {
	return state.error;
});

export const getHierarchyErrorMessage = createSelector(
	[getHierarchyError],
	(error): string => {
		if (!error || !error.error) return '';

		const { detail } = error.error;

		return detail;
	},
);

export const getHierarchyFilter = createSelector(
	[state],
	({ listFilters }) => listFilters
)

export const getHierarchyIsFetching = createSelector(
	[state],
	(state) => state.status === 'fetching',
);

export const getHierarchyIsFailure = createSelector(
	[state],
	(state) => state.status === 'failure',
);

export const getHierarchyIsEmpty = createSelector(
	[getHierarchyList, getHierarchyIsFetching],
	(list, isFetching) => list.length === 0 && !isFetching,
);




export const getHierarchyListFlow = createSelector(
	[state],
	(state) => state.hierarchyListFlow,
)

export const getListHierarchyAsOptions = createSelector([getHierarchyListFlow], (hierarchyListFlow) =>
	hierarchyListFlow
		.map(({ codigoHierarquia, hierarquia }) => ({ label: hierarquia, value: codigoHierarquia }))
);