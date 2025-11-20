import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'src/core/store';
import { State, TError } from './index'

const state = (state: RootState) => state.watsonSettings;

export const getListSettingsWatson = createSelector(
	[state],
	({ list }: State) => list
);

export const getItemSettingsWatson = createSelector(
	[state],
	({ item }: State) => item
);

export const getStatusSettingsWatson = createSelector(
	[state],
	({ status }) => status
);

export const getErrorMessageSettingsWatson = createSelector(
	[state],
	({ error }) => error as TError
);