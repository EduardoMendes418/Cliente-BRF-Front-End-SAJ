import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.equalizationResult;

export const getListEqualizationResult = createSelector(
	[state],
	({ list }: State) => list
);

export const getStatusEqualizationResult = createSelector(
	[state],
	({ status }) => status
);

