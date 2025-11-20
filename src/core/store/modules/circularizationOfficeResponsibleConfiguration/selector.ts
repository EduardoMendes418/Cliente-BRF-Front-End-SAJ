import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.CircularizationOfficeResponsibleConfiguration;

export const getOfficesList = createSelector([state], (state) => state.officesList);

export const getListCircularizationOfficeResponsibleConfiguration = createSelector(
	[state],
	({ list }: State) => list
);

export const getOfficeListAsOptions = createSelector([getOfficesList], (areas: any) =>
	{
		return areas?.data?.map((area: { name: any; id: any; }) => ({ label: area.name, value: area.id })) ?? [] 
	},
);

export const getOfficeListPathAsOptions = createSelector([getOfficesList], (areas: any) =>
	{
		return areas?.data?.map((area: { path: string; id: any; }) => ({ label: area.path, value: area.id })) ?? [] 
	},
);

export const getListFiltersCircularizationOfficeResponsibleConfiguration = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getLoadingCircularizationOfficeResponsibleConfiguration = createSelector(
	[state],
	(state) => state.status === 'fetching'
);