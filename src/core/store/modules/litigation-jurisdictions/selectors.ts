import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { convertToOptions } from 'src/core/utils/func';

const state = (state: RootState) => state.litigationJurisdictions;

export const getListComarca = createSelector(
	[state],
	(state) => state.list ?? []
);

export const getListComarcaAsOptions = createSelector(
	[getListComarca],
	(list) => convertToOptions(list)
);

export const getIsFetchingComarca = createSelector(
	[state],
	({ status }) => status === 'fetching',
);

