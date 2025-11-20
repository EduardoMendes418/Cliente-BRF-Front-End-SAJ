import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.circularizationBaseGenerationHeader;

export const getListOffices = createSelector(
		[state],
		({ listOffices }: State) => listOffices?.map<any>((area: any) => {
			return {
					id: area?.id,
					name: area?.path,
					subItems: area?.subItens?.map((item: any) => {
					return {
							label: item.path,
							value: item.id,
							groupItem: item.subgroup
					}
			})
		};
	})
); 

export const getListCircularizationBaseGenerationHeader = createSelector(
	[state],
	({ list }: State) => list
);

export const getListFiltersCircularizationBaseGenerationHeader = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getLoadingCircularizationBaseGenerationHeader = createSelector(
	[state],
	(state) => state.status === 'fetching'
);

export const getCircularizationBaseGenerationState = createSelector(
	[state],
	(state) => state.status
);