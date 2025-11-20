import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../../index';

const state = (state: RootState) => state.goodsGuaranteesEstimates;

export const getErrorGoodsGuaranteesEstimates = createSelector(
	[state],
	(state) => state.error,
);

export const getIsSavingGoodsGuaranteesEstimates = createSelector(
	[state],
	(state) => state.status === 'saving',
);

export const getStatusGoodsGuaranteesEstimates = createSelector(
	[state],
	(state) => state.status,
);

export const getErrorMessageGoodsGuaranteesEstimates = createSelector(
	[getErrorGoodsGuaranteesEstimates],
	(error): string => {
		if (!error) return '';

		if (typeof error === 'object' && error !== null) return (error as any).error;

		return error as string;
	},
);