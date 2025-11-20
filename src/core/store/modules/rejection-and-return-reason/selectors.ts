import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'src/core/store';
import { REASON_TYPE } from 'src/screen/settings/general/evaluation-reason/constants';
import { State } from './index'

const state = (state: RootState) => state.rejectionAndReturnReason;

export const getListRejectionAndReturnReason = createSelector(
	[state],
	({ list }: State) => list
);

export const getItemRejectionAndReturnReason = createSelector(
	[state],
	({ item }) => item
);

export const getHasItemRejectionAndReturnReason = createSelector(
	[state],
	({ item }) => !!item.id
);

export const getStatusRejectionAndReturnReason = createSelector(
	[state],
	({ status }) => status
);

export const getLoadingRejectionAndReturnReason = createSelector(
	[state],
	({ status }) => status === 'fetching'
);

export const getErrorMessageRejectionAndReturnReason = createSelector(
	[state],
	({ error }: State): string => {
		if (!error) return '';

		if (typeof error === 'object' && error !== null) return (error as any).error;

		return error as string;
	}
);

export const getListFiltersRejectionAndReturnReason = createSelector(
	[state],
	({ listFilters }: State) => listFilters
)

export const getListReturnReasonsAsOptions = createSelector([getListRejectionAndReturnReason], (list) =>
	list
		.filter(({ reasonType }) => reasonType === REASON_TYPE.RETURN)
		.map(({ description, id }) => ({ label: description, value: Number(id) }))
);

export const getListRejectionReasonsAsOptions = createSelector([getListRejectionAndReturnReason], (list) =>
	list
		.filter(({ reasonType }) => reasonType === REASON_TYPE.REJECTION)
		.map(({ description, id }) => ({ label: description, value: Number(id) }))
);

export const getListCanceledReasonsAsOptions = createSelector([getListRejectionAndReturnReason], (list) =>
	list
		.filter(({ reasonType }) => reasonType === REASON_TYPE.CANCELATION)
		.map(({ description, id }) => ({ label: description, value: Number(id) }))
);

export const getListReversalReasonsAsOptions = createSelector([getListRejectionAndReturnReason], (list) =>
	list
		.filter(({ reasonType }) => reasonType === REASON_TYPE.REVERSAL)
		.map(({ description, id }) => ({ label: description, value: Number(id) }))
);

