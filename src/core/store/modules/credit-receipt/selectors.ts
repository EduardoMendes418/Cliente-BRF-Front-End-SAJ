import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';

const state = (state: RootState) => state.creditReceipt;

export const getStatusCreditReceipt = createSelector(
	[state],
	(state) => state.status,
);

export const getErrorCreditReceipt = createSelector(
	[state],
	(state) => state.error,
);

export const getIsSavingCreditReceipt = createSelector(
	[state],
	(state) => state.status === 'saving',
);

export const getLoadingCreditReceipt = createSelector(
	[state],
	(state) => state.status === 'fetching',
);

export const getFiltersCreditReceipt = createSelector(
	[state],
	(state) => state.listFilters,
);

export const getListCreditReceipt = createSelector(
	[state],
	(state) => state.list ?? []
);

export const getItemCreditReceipt = createSelector(
	[state],
	(state) => state.item,
);

export const getHasCreditReceipt = createSelector(
	[state],
	({ item }) => !!item.id
);

export const getErrorMessageCreditReceipt = createSelector(
	[getErrorCreditReceipt],
	(error): string => {
		if (!error) return '';

		if (typeof error === 'object' && error !== null) return (error as any).error;

		return error as string;
	},
);

export const getCreditReceiptSearch = createSelector(
	[state],
	(state) => {
		const { folderNumber, willLinkAPayment } = state;
		return { folderNumber, willLinkAPayment };
	}
);
