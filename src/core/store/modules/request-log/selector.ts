import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.requestLog;

export const getListRequestLog= createSelector(
	[state],
	({ list }: State) => list
);

export const getListFiltersRequestLog = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getStatusRequestLog = createSelector(
	[state],
	({ status }) => status
);

export const getErrorMessageRequestLog = createSelector(
	[state],
	({ error }: State): string => error?.detail
);

export const getLoadingRequestLog = createSelector(
	[state],
	({ status }) => status === 'fetching'
);



// export const getItemRequestParameters = createSelector(
// 	[state],
// 	({ item }: State) => item
// );

// export const getHasItemRequestParameters = createSelector(
// 	[getItemRequestParameters],
// 	({ id }) => !!id
// );

// export const getStatusRequestParameters = createSelector(
// 	[state],
// 	({ status }) => status
// );

// export const getLoadingRequestParameters = createSelector(
// 	[state],
// 	({ status }) => status === 'fetching'
// );

// export const getErrorMessageRequestParameters = createSelector(
// 	[state],
// 	({ error }: State): string => error?.detail
// );

// export const getListFiltersRequestParameters = createSelector(
// 	[state],
// 	({ listFilters }: State) => listFilters
// );

// export const getRequestParametersAsOptions = createSelector(
// 	[state],
// 	({ list }) => list.map((
// 		{ requestType, id, responsibleType, statusFolderNumber }) => (
// 			{ label: requestType ?? '', value: id ?? '', responsibleType, statusFolderNumber }
// 		) as TSelectRequestType )
// );