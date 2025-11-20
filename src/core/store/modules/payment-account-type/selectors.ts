import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { TError } from './index'

const state = (state: RootState) => state.paymentAccountType;

export const getListPaymentAccountType = createSelector(
	[state],
	(state) => state.list ?? []
);

export const getStatusPaymentAccountType= createSelector(
	[state],
	(state) => state.status
);

export const getErrorPaymentAccountType= createSelector(
	[state],
	({ error }) => error as TError
);

export const getLoadingPaymentAccountType = createSelector(
	[state],
	(state) => state.status === 'fetching'
);