import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.closures;


export const getListClosures = createSelector(
	[state],
	({ list }: State) => list
);

export const getStatusClosures = createSelector(
	[state],
	({ status }) => status
);

export const getErrorMessageClosures = createSelector(
	[state],
	({ error }: State): string => {
		if (!error) return '';

		if (typeof error === 'object' && error !== null) return (error as any).detail;

		return error as string;
	}
);
