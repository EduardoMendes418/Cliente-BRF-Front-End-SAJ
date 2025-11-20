import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './types'

const state = (state: RootState) => state.eSocialAreas;

export const getListESocialAreas = createSelector(
	[state],
	({ list }: State) => list
);

export const getItemESocialAreas = createSelector(
	[state],
	({ item }: State) => item
);

export const getLoadingESocialAreas = createSelector(
	[state],
	(state) => state.status === 'fetching'
);
